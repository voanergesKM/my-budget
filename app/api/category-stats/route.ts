import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTransactiopnsSummary } from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const origin = searchParams.get("origin");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const currentUser = await getUser(token);

  const categories = await getTransactiopnsSummary(
    currentUser,
    groupId,
    origin || "outgoing",
    from ? new Date(from) : undefined,
    to ? new Date(to) : undefined
  );

  return NextResponse.json(
    { success: true, data: categories },
    { status: 200 }
  );
});
