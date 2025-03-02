import { NextResponse } from "next/server";
import { getUser } from "@/app/lib/actions/auth";
import { addUser } from "@/app/lib/db/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const existedUser = await getUser(email);
    if (existedUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // add the User to the database
    await addUser(email, password, name);

    const user = await getUser(email);
    return NextResponse.json(
      { message: "User created successfully", data: user },
      { status: 201 } // 201 - Created
    );
  } catch (e) {
    console.error("Error creating user:", e);

    return NextResponse.json(
      { message: "Internal Server Error", error: (e as Error).message },
      { status: 500 } // 500 - Internal Server Error
    );
  }
}
