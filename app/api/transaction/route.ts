import { NextRequest, NextResponse } from "next/server";

import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const { groupId, transactions } = payload;

  const currentUser = await getUser(token);

  const promises = transactions.map((transaction: any) => {
    return createTransaction(currentUser, groupId, transaction);
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

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
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

  const currentUser = await getUser(token);

  const data = await updateTransaction(currentUser, transactionId, payload);

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

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const body = await req.json();

  const { ids } = body;

  const currentUser = await getUser(token);

  await Promise.all(
    ids.map((id: string) => deleteTransaction(currentUser, id))
  );

  return new NextResponse(null, { status: 204 });
});
