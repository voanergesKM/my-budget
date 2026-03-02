import { NextRequest } from "next/server";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

export function withGroupAccess(handler: any) {
  return async (req: NextRequest, context: any) => {
    const { token, t } = context;

    const { searchParams } = new URL(req.url);

    const groupId = searchParams.get("groupId");

    if (token.role !== "admin" && groupId) {
      if (!token.groups.some((g: string) => g === groupId)) {
        throw new ForbiddenError(t("groupAccessDenied"));
      }
    }

    return handler(req, { ...context });
  };
}
