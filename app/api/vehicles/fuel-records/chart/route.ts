import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getUser } from "@/app/lib/db/controllers/userController";
import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { ServiceRecord } from "@/app/lib/db/models/ServiceRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import dbConnect from "@/app/lib/db/mongodb";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";

export type FuelChartPeriod =
  | "current_month"
  | "last_30_days"
  | "3_months"
  | "6_months"
  | "year"
  | "2_years"
  | "all_time";

export type FuelChartRefuelingPoint = {
  date: string;
  consumption: number | null;
  liters: number;
  odometer: number;
  station: string;
  trip: number;
  amount: number;
  currency: string;
  pricePerLiter: number | null;
  costPerKm: number | null;
};

export type FuelChartMonthPoint = {
  month: string; // "YYYY-MM"
  avgConsumption: number | null;
  totalAmount: number;
  totalLiters: number;
  totalTrip: number;
  avgPricePerLiter: number | null;
  costPerKm: number | null;
  count: number;
};

export type FuelChartCostPerKmPoint = {
  dateKey: string; // "YYYY-MM" or "YYYY-MM-DD"
  totalAmount: number;
  fuelAmount: number;
  serviceAmount: number;
  totalTrip: number;
  costPerKm: number | null;
};

export type FuelChartResponse =
  | {
      period: "current_month" | "last_30_days";
      data: FuelChartRefuelingPoint[];
      costPerKmData: FuelChartCostPerKmPoint[];
    }
  | {
      period: "3_months" | "6_months" | "year" | "2_years" | "all_time";
      data: FuelChartMonthPoint[];
      costPerKmData: FuelChartCostPerKmPoint[];
    };

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  await dbConnect();

  const currentUser = await getUser(token);
  const { searchParams } = new URL(req.url);

  const vehicleId = searchParams.get("vehicleId");
  const period = (searchParams.get("period") ??
    "last_30_days") as FuelChartPeriod;

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

  if (period === "current_month" || period === "last_30_days") {
    const startDate =
      period === "current_month"
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    const records = await FuelRecord.find({
      vehicle: vehicleId,
      createdAt: { $gte: startDate },
    })
      .sort({ odometer: 1 })
      .lean();

    const mongoose = await import("mongoose");
    const vehicleObjectId = new mongoose.default.Types.ObjectId(vehicleId);
    const [fuelCostsByDay, serviceCostsByDay] = await Promise.all([
      FuelRecord.aggregate([
        { $match: { vehicle: vehicleObjectId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            fuelAmount: { $sum: "$amount" },
            totalTrip: { $sum: "$trip" },
          },
        },
      ]),
      ServiceRecord.aggregate([
        { $match: { vehicle: vehicleObjectId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            serviceAmount: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const costPerKmData = buildCostPerKmData(
      fuelCostsByDay,
      serviceCostsByDay,
      "day"
    );

    const data: FuelChartRefuelingPoint[] = records.map((r) => {
      const amount = Number(r.amount);
      const liters = Number(r.liters);
      const trip = Number(r.trip ?? 0);

      return {
        date: new Date(r.createdAt).toISOString(),
        consumption: r.consumption
          ? Number((r.consumption as number).toFixed(2))
          : null,
        liters,
        odometer: Number(r.odometer),
        station: r.station ?? "",
        trip,
        amount,
        currency: r.currency || "USD",
        pricePerLiter: liters > 0 ? Number((amount / liters).toFixed(2)) : null,
        costPerKm: trip > 0 ? Number((amount / trip).toFixed(2)) : null,
      };
    });

    return NextResponse.json(
      { success: true, data: { period, data, costPerKmData } },
      { status: 200 }
    );
  }

  // Aggregated monthly average consumption
  let startDate: Date | null = null;
  if (period !== "all_time") {
    const monthsBack =
      period === "3_months"
        ? 3
        : period === "6_months"
          ? 6
          : period === "year"
            ? 12
            : 24; // "2_years"
    startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);
  }

  const mongoose = await import("mongoose");
  const vehicleObjectId = new mongoose.default.Types.ObjectId(vehicleId);

  const matchStage: any = { vehicle: vehicleObjectId };
  if (startDate) {
    matchStage.createdAt = { $gte: startDate };
  }

  const serviceAggPipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        serviceAmount: { $sum: "$amount" },
      },
    },
  ];

  const aggPipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        avgConsumption: { $avg: "$consumption" },
        totalAmount: { $sum: "$amount" },
        totalLiters: { $sum: "$liters" },
        totalTrip: { $sum: "$trip" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1 as 1 | -1, "_id.month": 1 as 1 | -1 } },
  ];

  const [results, serviceCostsByMonth] = await Promise.all([
    FuelRecord.aggregate(aggPipeline),
    ServiceRecord.aggregate(serviceAggPipeline),
  ]);

  const costPerKmData = buildCostPerKmData(
    results.map((r) => ({
      ...r,
      fuelAmount: r.totalAmount,
    })),
    serviceCostsByMonth,
    "month"
  );

  const data: FuelChartMonthPoint[] = results.map((r) => {
    const year = r._id.year as number;
    const month = r._id.month as number; // 1-based
    const totalAmount = Number(r.totalAmount);
    const totalLiters = Number(r.totalLiters);
    const totalTrip = Number(r.totalTrip);

    return {
      month: `${year}-${String(month).padStart(2, "0")}`,
      avgConsumption: r.avgConsumption
        ? Number(r.avgConsumption.toFixed(2))
        : null,
      totalAmount: Number(totalAmount.toFixed(2)),
      totalLiters: Number(totalLiters.toFixed(2)),
      totalTrip: Number(totalTrip.toFixed(2)),
      avgPricePerLiter:
        totalLiters > 0 ? Number((totalAmount / totalLiters).toFixed(2)) : null,
      costPerKm:
        totalTrip > 0 ? Number((totalAmount / totalTrip).toFixed(2)) : null,
      count: r.count,
    };
  });

  return NextResponse.json(
    { success: true, data: { period, data, costPerKmData } },
    { status: 200 }
  );
});

function buildCostPerKmData(
  fuelResults: any[],
  serviceResults: any[],
  dateFormat: "day" | "month"
): FuelChartCostPerKmPoint[] {
  const dataMap = new Map<string, FuelChartCostPerKmPoint>();

  const getKey = (id: any) => {
    const year = id.year;
    const month = String(id.month).padStart(2, "0");

    if (dateFormat === "month") {
      return `${year}-${month}`;
    }

    const day = String(id.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getPoint = (key: string) => {
    if (!dataMap.has(key)) {
      dataMap.set(key, {
        dateKey: key,
        totalAmount: 0,
        fuelAmount: 0,
        serviceAmount: 0,
        totalTrip: 0,
        costPerKm: null,
      });
    }

    return dataMap.get(key)!;
  };

  for (const result of fuelResults) {
    const key = getKey(result._id);
    const point = getPoint(key);
    point.fuelAmount += Number(result.fuelAmount ?? 0);
    point.totalTrip += Number(result.totalTrip ?? 0);
  }

  for (const result of serviceResults) {
    const key = getKey(result._id);
    const point = getPoint(key);
    point.serviceAmount += Number(result.serviceAmount ?? 0);
  }

  return Array.from(dataMap.values())
    .map((point) => {
      const totalAmount = point.fuelAmount + point.serviceAmount;

      return {
        ...point,
        totalAmount: Number(totalAmount.toFixed(2)),
        fuelAmount: Number(point.fuelAmount.toFixed(2)),
        serviceAmount: Number(point.serviceAmount.toFixed(2)),
        totalTrip: Number(point.totalTrip.toFixed(2)),
        costPerKm:
          point.totalTrip > 0
            ? Number((totalAmount / point.totalTrip).toFixed(2))
            : null,
      };
    })
    .filter((point) => point.costPerKm != null)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}
