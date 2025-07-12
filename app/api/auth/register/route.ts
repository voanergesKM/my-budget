import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

import { createUser } from "@/app/lib/db/controllers/userController";

export async function POST(request: Request) {
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
      { message: "User created successfully", data: user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already in use",
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
