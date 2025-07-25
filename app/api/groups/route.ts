import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getAllGroups } from "@/app/lib/db/controllers/groupController";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const groups = await getAllGroups(currentUser);

  return NextResponse.json({ success: true, data: groups }, { status: 200 });
});
