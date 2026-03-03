import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/lib/definitions";
import { normalizeDateToUTC } from "@/app/lib/utils/dateUtils";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { scheduledPaymentService } from "@/app/lib/db/services/scheduledPayment.service";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";
import { createScheduledPaymentSchema } from "@/app/lib/schema/scheduledPayment.schema";
import { ScheduledPaymentType } from "@/app/lib/types";

export const POST = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (
  req: NextRequest,
  { user, payload }: { user: User; payload: Partial<ScheduledPaymentType> }
) => {
  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const parsed = createScheduledPaymentSchema((key) => key).parse(payload);
  const local = new Date(parsed.proceedDate);
  payload.proceedDate = normalizeDateToUTC(local);

  const scheduledPayment = await scheduledPaymentService.create(user, payload);

  const message = t("created", {
    entity: te("scheduledPayment.nominative"),
    name: "",
  });

  return NextResponse.json(
    { success: true, data: scheduledPayment, message },
    { status: 200 }
  );
});

export const PATCH = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (
  req: NextRequest,
  { user, payload }: { user: User; payload: ScheduledPaymentType }
) => {
  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const { _id: paymentId, ...payment } = payload;

  const parsed = createScheduledPaymentSchema((key) => key).parse(payment);
  const local = new Date(parsed.proceedDate);
  payment.proceedDate = normalizeDateToUTC(local);

  const scheduledPayment = await scheduledPaymentService.updateOne(
    user,
    paymentId,
    payload
  );

  const message = t("created", {
    entity: te("scheduledPayment.nominative"),
    name: "",
  });

  return NextResponse.json(
    { success: true, data: scheduledPayment, message },
    { status: 200 }
  );
});

export const DELETE = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user }: { user: User }) => {
  const body = await req.json();

  const { ids } = body;

  await scheduledPaymentService.deleteMany(user, ids);

  return new NextResponse(null, { status: 204 });
});
