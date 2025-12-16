import { NextRequest, NextResponse } from "next/server";

import { updateRatesForToday } from "@/app/lib/api/updateRatesForToday";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await updateRatesForToday();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error updating rates", { status: 500 });
  }
}
