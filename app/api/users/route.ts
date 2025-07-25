import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createUser,
  getUser,
  getUserByEmail,
} from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  if (id) {
    const user = await getUser(token);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  }

  if (email) {
    const user = await getUserByEmail(email);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  }

  // const users = await getAllUsers();
  return NextResponse.json({ success: false, data: null }, { status: 404 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest) => {
  const body = await req.json();

  const user = await createUser(body);

  return NextResponse.json({ success: true, data: user }, { status: 201 });
});
