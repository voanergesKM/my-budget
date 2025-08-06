import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const { groupId, ...rest } = payload;

  const currentUser = await getUser(token);

  const data = await createTransaction(currentUser, groupId, rest);

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: `Transaction successfully created`,
    },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const request = await req.json();

  const transactionId = request._id;

  const payload = {
    description: request.description,
    amount: request.amount,
    type: request.type,
    currency: request.currency,
    category: request.category,
    createdAt: request.createdAt,
  };

  const currentUser = await getUser(token);

  const data = await updateTransaction(currentUser, transactionId, payload);

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: `Transaction successfully updated`,
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
