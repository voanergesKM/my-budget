import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createShopping,
  deleteShoppings,
  getShoppingById,
  getShoppingsList,
  updateShopping,
} from "@/app/lib/db/controllers/shoppingListController";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const shoppingId = searchParams.get("id");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const currentUser = await getUser(token);

  if (shoppingId) {
    const data = await getShoppingById(shoppingId, currentUser);
    return NextResponse.json({ success: true, data }, { status: 200 });
  }

  const list = await getShoppingsList({
    groupId,
    currentUser,
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
  });

  return NextResponse.json({ success: true, data: list }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const body = await req.json();

  const { groupId, ...payload } = body;

  const currentUser = await getUser(token);

  const item = await createShopping(currentUser, groupId, payload);

  return NextResponse.json(
    { success: true, data: item, message: "List created successfully" },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const currentUser = await getUser(token);

  const item = await updateShopping(payload, currentUser);

  return NextResponse.json(
    { success: true, data: item, message: "List updated successfully" },
    { status: 200 }
  );
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const body = await req.json();

  const { ids } = body;

  const currentUser = await getUser(token);

  await deleteShoppings(ids, currentUser);

  return NextResponse.json(
    { success: true, data: null, message: "Shopping deleted successfully" },
    { status: 200 }
  );
});
