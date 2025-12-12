import { NextRequest, NextResponse } from "next/server";

import { normalizeDateToUTC } from "@/app/lib/utils/dateUtils";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createScheduledPayment,
  deleteScheduledPayment,
  updateScheduledPayment,
} from "@/app/lib/db/controllers/scheduledPaymentsController";
import { getUser } from "@/app/lib/db/controllers/userController";
import { createScheduledPaymentSchema } from "@/app/lib/schema/scheduledPaymentsSchema";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const currentUser = await getUser(token);

  const parsed = createScheduledPaymentSchema((key) => key).parse(payload);
  const local = new Date(parsed.proceedDate);
  const proceedDate = normalizeDateToUTC(local);

  payload.proceedDate = proceedDate;

  const scheduledPayment = await createScheduledPayment(currentUser, payload);

  const message = t("created", {
    entity: te("scheduledPayment.nominative"),
    name: "",
  });

  return NextResponse.json(
    { success: true, data: scheduledPayment, message },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const request = await req.json();

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const { _id: paymentId, ...payload } = request;

  const currentUser = await getUser(token);

  const parsed = createScheduledPaymentSchema((key) => key).parse(payload);
  const local = new Date(parsed.proceedDate);
  const proceedDate = normalizeDateToUTC(local);

  payload.proceedDate = proceedDate;

  const data = await updateScheduledPayment(currentUser, paymentId, payload);

  const message = t("updated", {
    entity: te("scheduledPayment.nominative"),
    name: "",
  });

  return NextResponse.json(
    {
      success: true,
      data: data,
      message,
    },
    { status: 200 }
  );
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const body = await req.json();

  const { ids } = body;

  const currentUser = await getUser(token);

  await Promise.all(
    ids.map((id: string) => deleteScheduledPayment(currentUser, id))
  );

  return new NextResponse(null, { status: 204 });
});
