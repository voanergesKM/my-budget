import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/app/lib/db/mongodb";
import { processScheduledPayments } from "@/app/lib/services/processScheduledPayments";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  await dbConnect();

  await processScheduledPayments(new Date());

  return NextResponse.json({ ok: true });
}
