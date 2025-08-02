import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createCategory,
  updateCategory,
} from "@/app/lib/db/controllers/categoryControllers";
import { getUser } from "@/app/lib/db/controllers/userController";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const { groupId, ...rest } = payload;

  const currentUser = await getUser(token);

  const data = await createCategory(currentUser, groupId, rest);

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: `Category ${data.name} successfully created`,
    },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const { groupId, group, ...rest } = payload;

  const currentUser = await getUser(token);

  const data = await updateCategory(currentUser, groupId, rest);

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: `Category ${data.name} successfully updated`,
    },
    { status: 200 }
  );
});
