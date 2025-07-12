import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function getValidToken(req: NextRequest) {
  const names = ["__Secure-authjs.session-token", "authjs.session-token"];

  for (const name of names) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: name,
    });

    if (token) return token;
  }

  return null;
}
