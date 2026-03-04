import { NextRequest } from "next/server";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

export function withGroupAccess(handler: any) {
  return async (req: NextRequest, context: any) => {
    const { token, t } = context;

    let payload: any = null;

    if (req.method === "POST" || req.method === "PATCH") {
      payload = await req.json();
    }

    const { searchParams } = new URL(req.url);
    const groupId =
      searchParams.get("groupId") ||
      payload?.group?._id ||
      payload?.group ||
      payload?.groupId?._id ||
      payload?.groupId;

    if (token.role !== "admin" && groupId) {
      if (!token.groups.some((g: string) => g === groupId)) {
        throw new ForbiddenError(t("groupAccessDenied"));
      }
    }

    return handler(req, { ...context, payload });
  };
}
