import { NextRequest, NextResponse } from "next/server";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";
import { getShoppingsList, createShopping } from "@/app/lib/db/controllers/shoppingListController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const list = await getShoppingsList(groupId, token.id);

  return NextResponse.json({ success: true, data: list }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {

  const body = await req.json();

  const {groupId, ...payload } = body;

  const item = await createShopping(token.id, groupId, payload);

  return NextResponse.json({ success: true, data: item }, { status: 200 });
});
