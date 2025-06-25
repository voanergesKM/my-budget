import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
} from "@/app/lib/db/controllers/userController";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";
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
