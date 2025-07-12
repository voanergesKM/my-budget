import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { toggleShoppingStatus } from "@/app/lib/db/controllers/shoppingListController";

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { id: userId, groupId: userGroupIds } = token;
  const payload = await req.json();

  const item = await toggleShoppingStatus(payload, userId, userGroupIds);

  return NextResponse.json(
    { success: true, data: item, message: "List updated successfully" },
    { status: 200 }
  );
});
