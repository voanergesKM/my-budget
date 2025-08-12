import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { updateRatesForToday } from "@/app/lib/api/updateRatesForToday";

export const GET = wrapPrivateHandler(async (req: NextRequest) => {
  const currentRates = await updateRatesForToday();

  return NextResponse.json(
    { success: false, data: currentRates },
    { status: 200 }
  );
});
