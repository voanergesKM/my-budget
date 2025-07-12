import { NextRequest, NextResponse } from "next/server";

import { wrapHandler } from "@/app/lib/utils/wrapHandler";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
} from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  console.log(token);

  if (id) {
    const user = await getUserById(id);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  }

  if (email) {
    const user = await getUserByEmail(email);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  }

  const users = await getAllUsers();
  return NextResponse.json({ success: true, data: users }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest) => {
  const body = await req.json();

  const user = await createUser(body);

  return NextResponse.json({ success: true, data: user }, { status: 201 });
});
