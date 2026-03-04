import { NextRequest, NextResponse } from "next/server";

import { User } from "@/app/lib/definitions";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { categoryService } from "@/app/lib/db/services";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";

export const POST = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user, payload }: { user: User; payload: any }) => {
  const { groupId, _id, ...rest } = payload;

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const data = await categoryService.create(user, groupId, rest);

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: t("created", {
        entity: te("category.nominative"),
        name: data.name,
      }),
    },
    { status: 200 }
  );
});

export const PATCH = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user, payload }: { user: User; payload: any }) => {
  const { _id: categoryId, ...rest } = payload;

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const data = await categoryService.updateOne(user, categoryId, rest);

  return NextResponse.json(
    {
      success: true,
      data: data,
      message: t("created", {
        entity: te("category.nominative"),
        name: data.name,
      }),
    },
    { status: 200 }
  );
});
