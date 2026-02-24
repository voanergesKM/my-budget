import { NextRequest, NextResponse } from "next/server";

import { NotAuthorizedError } from "../errors/customErrors";

import { getValidToken } from "./getValidToken";
import { withServerTranslations } from "./withServerTranslations";
import { wrapHandler } from "./wrapHandler";

export function wrapPrivateHandler<TParams extends Record<string, string>>(
  handler: (
    req: NextRequest,
    user: any,
    context: { params: Promise<TParams> }
  ) => Promise<NextResponse>
) {
  return wrapHandler(
    async (req: NextRequest, context: { params: Promise<TParams> }) => {
      const token = await getValidToken(req);
      const t = await withServerTranslations("Notifications");

      if (!token) {
        throw new NotAuthorizedError(t("notAuthorized"));
      }

      return handler(req, token, context);
    }
  );
}
