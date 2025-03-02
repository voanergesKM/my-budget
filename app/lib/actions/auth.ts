"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { User } from "../definitions";
import { requestUser } from "@/app/lib/db/auth";


export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await requestUser(email);
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function authorize() {}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}


