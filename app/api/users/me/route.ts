import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getUserByEmail, updateUser } from "@/app/lib/db/controllers/userController";
import { NotFoundError } from "@/app/lib/errors/customErrors";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const email = token.email;

  if (email) {
    const user = await getUserByEmail(email);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } else {
    throw new NotFoundError("User not found");
  }
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const id = token.id;

  const body = await req.json();

  const updatedUser = await updateUser(id, body);

  return NextResponse.json(
    { success: true, data: updatedUser, message: "User updated successfully" },
    { status: 200 }
  );
});
