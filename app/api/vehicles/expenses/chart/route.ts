import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getUser } from "@/app/lib/db/controllers/userController";
import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { ServiceRecord } from "@/app/lib/db/models/ServiceRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import dbConnect from "@/app/lib/db/mongodb";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";

export type ExpensesChartPeriod =
  | "current_month"
  | "last_30_days"
  | "3_months"
  | "6_months"
  | "year"
  | "2_years"
  | "all_time";

export type ExpensesChartPoint = {
  dateKey: string; // "YYYY-MM" or "YYYY-MM-DD"
  fuel: number;
  [category: string]: number | string; // Other categories from SERVICE_CATEGORIES
};

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  await dbConnect();

  const currentUser = await getUser(token);
  const { searchParams } = new URL(req.url);

  const vehicleId = searchParams.get("vehicleId");
  const period = (searchParams.get("period") ??
    "last_30_days") as ExpensesChartPeriod;

  if (!vehicleId) {
    return NextResponse.json(
      { success: false, message: "vehicleId is required" },
      { status: 400 }
    );
  }

  await withAccessCheck(() => Vehicle.findById(vehicleId), currentUser, {
    getGroupId: (s) => s.group,
  }).catch(() => {
    throw new NotAuthorizedError();
  });

  const now = new Date();
  let startDate: Date | null = null;
  let dateFormat: "day" | "month";

  if (period === "current_month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFormat = "day";
  } else if (period === "last_30_days") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);
    dateFormat = "day";
  } else if (period === "all_time") {
    startDate = null;
    dateFormat = "month";
  } else {
    const monthsBack =
      period === "3_months"
        ? 3
        : period === "6_months"
        ? 6
        : period === "year"
        ? 12
        : 24; // "2_years"
    startDate = new Date(
      now.getFullYear(),
      now.getMonth() - monthsBack + 1,
      1
    );
    dateFormat = "month";
  }

  const vehicleObjectId = new mongoose.Types.ObjectId(vehicleId);

  const matchStage: any = { vehicle: vehicleObjectId };
  if (startDate) {
    matchStage.createdAt = { $gte: startDate };
  }

  // 1. Fetch Fuel Records
  const fuelAggPipeline = [
    { $match: matchStage },
    {
      $group: {
        _id:
          dateFormat === "month"
            ? {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              }
            : {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
        amount: { $sum: "$amount" },
      },
    },
  ];

  // 2. Fetch Service Records
  const serviceAggPipeline = [
    { $match: matchStage },
    {
      $group: {
        _id:
          dateFormat === "month"
            ? {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                category: "$category",
              }
            : {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                category: "$category",
              },
        amount: { $sum: "$amount" },
      },
    },
  ];

  const [fuelResults, serviceResults] = await Promise.all([
    FuelRecord.aggregate(fuelAggPipeline),
    ServiceRecord.aggregate(serviceAggPipeline),
  ]);

  const dataMap = new Map<string, ExpensesChartPoint>();

  const getFormatKey = (id: any) => {
    const y = id.year;
    const m = String(id.month).padStart(2, "0");
    if (dateFormat === "month") {
      return `${y}-${m}`;
    }
    const d = String(id.day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Merge Fuel
  for (const r of fuelResults) {
    const key = getFormatKey(r._id);
    if (!dataMap.has(key)) {
      dataMap.set(key, { dateKey: key, fuel: 0 });
    }
    const point = dataMap.get(key)!;
    point.fuel = Number((point.fuel + r.amount).toFixed(2));
  }

  // Merge Service
  for (const r of serviceResults) {
    const key = getFormatKey(r._id);
    if (!dataMap.has(key)) {
      dataMap.set(key, { dateKey: key, fuel: 0 });
    }
    const point = dataMap.get(key)!;
    const cat = r._id.category as string;
    const currentCatAmount = (point[cat] as number) || 0;
    point[cat] = Number((currentCatAmount + r.amount).toFixed(2));
  }

  // Convert to sorted array
  const data = Array.from(dataMap.values()).sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey)
  );

  return NextResponse.json(
    { success: true, data: { period, data } },
    { status: 200 }
  );
});
