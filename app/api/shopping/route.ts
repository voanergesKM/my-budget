import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { toggleShoppingStatus } from "@/app/lib/db/controllers/shoppingListController";
import { getUser } from "@/app/lib/db/controllers/userController";

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const dbUser = await getUser(token);

  const item = await toggleShoppingStatus(payload, dbUser);

  return NextResponse.json(
    { success: true, data: item, message: "List updated successfully" },
    { status: 200 }
  );
});
