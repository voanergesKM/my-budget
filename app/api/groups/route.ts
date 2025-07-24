import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getAllGroups } from "@/app/lib/db/controllers/groupController";

export const GET = wrapPrivateHandler(async (req: NextRequest) => {
  const groups = await getAllGroups(req);

  return NextResponse.json({ success: true, data: groups }, { status: 200 });
});
