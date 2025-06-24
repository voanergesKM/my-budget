import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { wrapHandler } from "./wrapHandler";
import { getValidToken } from "./getValidToken";

export function wrapPrivateHandler(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return wrapHandler(async (req: NextRequest) => {
    try {
      const token = await getValidToken(req);

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      return await handler(req, token);
    } catch (err) {
      console.error("wrapPrivateHandler error", err);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }
  });
}