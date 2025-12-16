import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getScheduledPayments } from "@/app/lib/db/controllers/scheduledPaymentsController";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);

  const groupId = searchParams.get("groupId");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const currentUser = await getUser(token);

  const list = await getScheduledPayments(
    currentUser,
    groupId,
    page ? +page : 1,
    pageSize ? +pageSize : 10
  );

  return NextResponse.json({ success: true, data: list }, { status: 200 });
});
