import { NextRequest, NextResponse } from "next/server";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";
import {
  getShoppingsList,
  createShopping,
  deleteShoppings,
  getShoppingById,
  updateShopping,
} from "@/app/lib/db/controllers/shoppingListController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { id: userId, groupId: userGroupIds } = token;
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const shoppingId = searchParams.get("id");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  if (shoppingId) {
    const data = await getShoppingById(shoppingId, userId, userGroupIds);
    return NextResponse.json({ success: true, data }, { status: 200 });
  }

  const list = await getShoppingsList({
    groupId,
    userId: token.id,
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 10,
  });

  return NextResponse.json({ success: true, data: list }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const body = await req.json();

  const { groupId, ...payload } = body;

  const item = await createShopping(token.id, groupId, payload);

  return NextResponse.json(
    { success: true, data: item, message: "List created successfully" },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { id: userId, groupId: userGroupIds } = token;
  const payload = await req.json();

  const item = await updateShopping(payload, userId, userGroupIds);

  return NextResponse.json(
    { success: true, data: item, message: "List updated successfully" },
    { status: 200 }
  );
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { id: userId, groupId: userGroupIds } = token;

  const body = await req.json();

  const { ids } = body;

  await deleteShoppings(ids, userId, userGroupIds);

  return NextResponse.json(
    { success: true, data: null, message: "Shopping deleted successfully" },
    { status: 200 }
  );
});
