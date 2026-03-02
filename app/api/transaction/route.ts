import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/lib/definitions";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { createTransaction } from "@/app/lib/db/controllers/transactionControllers";
import { transactionService } from "@/app/lib/db/services";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";

export const POST = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user }: { user: User }) => {
  const payload = await req.json();

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const { groupId, transactions } = payload;

  const promises = transactions.map((transaction: any) => {
    return createTransaction(user, groupId, transaction);
  });

  const data = await Promise.all(promises);

  const message = t("created", {
    entity: te("transaction.accusative"),
    name: "",
  });

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: message,
    },
    { status: 200 }
  );
});

export const PATCH = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user }: { user: User }) => {
  const request = await req.json();

  const transactionId = request._id;

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const payload = {
    description: request.description,
    amount: request.amount,
    type: request.type,
    currency: request.currency,
    category: request.category,
    createdAt: request.createdAt,
    amountInBaseCurrency: request.amountInBaseCurrency,
  };

  const data = await transactionService.updateOne(user, transactionId, payload);

  const message = t("updated", {
    entity: te("transaction.accusative"),
    name: "",
  });

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: message,
    },
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

  await transactionService.deleteMany(user, ids);

  return new NextResponse(null, { status: 204 });
});
