"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: { error?: string; redirectTo?: string },
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  try {
    await signIn("credentials", formData);

    const callbackUrl = formData.get("callbackUrl")?.toString() || "/dashboard";

    return { redirectTo: callbackUrl };
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
