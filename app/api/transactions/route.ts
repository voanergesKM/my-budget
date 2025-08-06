import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getAllTransactions } from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);

  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const currentUser = await getUser(token);

  const transactions = await getAllTransactions(
    currentUser,
    groupId,
    origin,
    page ? +page : 1,
    pageSize ? +pageSize : 10
  );

  return NextResponse.json(
    { success: true, data: transactions, message: "Transactions fetched" },
    { status: 200 }
  );
});
