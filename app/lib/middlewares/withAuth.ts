import { NextRequest } from "next/server";

import { getValidToken } from "@/app/lib/utils/getValidToken";

import { getUser } from "@/app/lib/db/controllers/userController";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";

export function withAuth(handler: any) {
  return async (req: NextRequest, context: any) => {
    const token = await getValidToken(req);

    if (!token) {
      throw new NotAuthorizedError();
    }

    const user = await getUser(token as any);

    return handler(req, { ...context, token, user });
  };
}
