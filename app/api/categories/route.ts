import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/lib/definitions";

import { categoryService } from "@/app/lib/db/services";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";

export const GET = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user }: { user: User }) => {
  const { searchParams } = new URL(req.url);

  const { groupId = null, ...query } = Object.fromEntries(
    Array.from(searchParams)
  );

  const categories = await categoryService.getAll(user, groupId, query);

  return NextResponse.json(
    { success: true, data: categories },
    { status: 200 }
  );
});
