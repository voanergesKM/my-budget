import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import dbConnect from "@/app/lib/db/mongodb";
import { ValidationError } from "@/app/lib/errors/customErrors";
import { mapFuelioRowToFuelRecord } from "@/app/lib/fuelio/mapFuelioRow";
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

    const fuel = records.Log.map((r) => mapFuelioRowToFuelRecord(r));
    const expenses = records.Costs;

    return NextResponse.json({
      success: true,
      records,
      sections: { fuel },
    });
  } catch (e) {
    throw new ValidationError();
  }
});
