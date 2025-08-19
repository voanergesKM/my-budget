import { NextResponse } from "next/server";
import { getLocale, getTranslations } from "next-intl/server";
import bcryptjs from "bcryptjs";

import { createUser } from "@/app/lib/db/controllers/userController";

export async function POST(request: Request) {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: "Notifications",
  });

  try {
    const { email, password, firstName, lastName } = await request.json();

    const hashedPassword = password ? await bcryptjs.hash(password, 10) : "";

    const user = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return NextResponse.json(
      {
        message: t("userCreated", { name: `${firstName} ${lastName}` }),
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json(
        {
          success: false,
          message: t("wrongCredentials"),
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
