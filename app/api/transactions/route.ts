import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/lib/definitions";

import { transactionService } from "@/app/lib/db/services/transaction.service";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";

export const GET = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user }: { user: User }) => {
  const { searchParams } = new URL(req.url);

  const { groupId = null, ...query } = Object.fromEntries(
    Array.from(searchParams)
  );

  const transactions = await transactionService.getAll(user, groupId, query);

  return NextResponse.json(
    { success: true, data: transactions, message: "Transactions fetched" },
    { status: 200 }
  );
});
