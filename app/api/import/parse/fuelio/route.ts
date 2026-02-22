import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import dbConnect from "@/app/lib/db/mongodb";
import { ValidationError } from "@/app/lib/errors/customErrors";
import {
  mapFuelioCostCategory,
  mapFuelioExpense,
  mapFuelioRowToFuelRecord,
} from "@/app/lib/fuelio/mapFuelioRow";
import { parseFuelioCsvBySections } from "@/app/lib/fuelio/parseFuelioCSV";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const csvText = buffer.toString("utf-8");

  try {
    const records = parseFuelioCsvBySections(csvText);

    const sections = {} as {
      fuel: any[];
      expenseCategories: any[];
      expenses: any[];
    };

    let expenseCategories = [] as any[];

    if ("Log" in records && records.Log.length > 0) {
      sections.fuel = records.Log.map((r, index, array) => {
        const trip = r["Odo (km)"] - array[index + 1]?.["Odo (km)"];
        return mapFuelioRowToFuelRecord(r, trip);
      });
    }

    const expenses = records.Costs;

    if ("Costs" in records && records.Costs.length > 0) {
      sections.expenses = records.Costs.map((r) => mapFuelioExpense(r));
    }

    if (
      "CostCategories" in records &&
      "Costs" in records &&
      records.CostCategories.length > 0
    ) {
      expenseCategories = records.CostCategories.reduce((acc, c) => {
        if (records.Costs.some((e) => e["CostTypeID"] === c["CostTypeID"])) {
          acc.push(mapFuelioCostCategory(c));
        }
        return acc;
      }, []);
    }

    return NextResponse.json({
      success: true,
      records,
      sections,
      expenseCategories,
    });
  } catch (e) {
    throw new ValidationError();
  }
});
