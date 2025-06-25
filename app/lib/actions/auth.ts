"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: { error?: string; redirectTo?: string },
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  try {
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const callbackUrl = formData.get("callbackUrl")?.toString() || "/dashboard";

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    redirect(callbackUrl);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
}
