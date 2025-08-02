import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getAllCategories } from "@/app/lib/db/controllers/categoryControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  const currentUser = await getUser(token);

  const categories = await getAllCategories(currentUser, origin, groupId);

  return NextResponse.json(
    { success: true, data: categories },
    { status: 200 }
  );
});
