import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTransactionsSummaryByMonth } from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const origin = searchParams.get("origin");

  const currentUser = await getUser(token);

  const summary = await getTransactionsSummaryByMonth(
    currentUser,
    groupId,
    origin || "outgoing"
  );

  return NextResponse.json({ success: true, data: summary }, { status: 200 });
});
