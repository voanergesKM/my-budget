import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/lib/definitions";

import { transactionService } from "@/app/lib/db/services";
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
  const groupId = searchParams.get("groupId");

  const origin = searchParams.get("origin");

  const summary = await transactionService.getSummaryByMonth(
    user,
    groupId,
    origin || "outgoing"
  );

  return NextResponse.json({ success: true, data: summary }, { status: 200 });
});
