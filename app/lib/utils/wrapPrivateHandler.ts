import { NextRequest, NextResponse } from "next/server";

import { NotAuthorizedError } from "../errors/customErrors";

import { getValidToken } from "./getValidToken";
import { wrapHandler } from "./wrapHandler";

export function wrapPrivateHandler(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return wrapHandler(async (req: NextRequest) => {
    const token = await getValidToken(req);

    if (!token) throw new NotAuthorizedError("Unauthorized user");

    return await handler(req, token);
  });
}
