import { NextRequest, NextResponse } from "next/server";

import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  getUserByEmail,
  updateUser,
} from "@/app/lib/db/controllers/userController";
import { NotFoundError } from "@/app/lib/errors/customErrors";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const email = token.email;

  const t = await withServerTranslations("Notifications");

  if (email) {
    const user = await getUserByEmail(email);

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: t("userFound", { name: user.fullName }),
      },
      { status: 200 }
    );
  } else {
    throw new NotFoundError(t("userNotFound"));
  }
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const id = token.id;

  const t = await withServerTranslations("Notifications");

  const body = await req.json();

  const updatedUser = await updateUser(id, body);

  return NextResponse.json(
    { success: true, data: updatedUser, message: t("userUpdated") },
    { status: 200 }
  );
});
