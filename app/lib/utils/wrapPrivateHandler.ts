import { NextRequest, NextResponse } from "next/server";

import { NotAuthorizedError } from "../errors/customErrors";

import { getValidToken } from "./getValidToken";
import { withServerTranslations } from "./withServerTranslations";
import { wrapHandler } from "./wrapHandler";

export function wrapPrivateHandler(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return wrapHandler(async (req: NextRequest) => {
    const token = await getValidToken(req);

    const t = await withServerTranslations("Notifications");

    if (!token) throw new NotAuthorizedError(t("notAuthorized"));

    return await handler(req, token);
  });
}
