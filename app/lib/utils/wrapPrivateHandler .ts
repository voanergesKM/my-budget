import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { wrapHandler } from "./wrapHandler";

export function wrapPrivateHandler(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return wrapHandler(async (req: NextRequest) => {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return await handler(req, token);
  });
}