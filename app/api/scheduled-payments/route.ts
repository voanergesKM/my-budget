import { NextRequest, NextResponse } from "next/server";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";
import { User } from "@/app/lib/definitions";
import { scheduledPaymentService } from "@/app/lib/db/services/scheduledPayment.service";

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

  const list = await scheduledPaymentService.getAll(user, groupId, query);

  return NextResponse.json({ success: true, data: list }, { status: 200 });
});
