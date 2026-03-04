import { NextRequest, NextResponse } from "next/server";

import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import {
  compose,
  withAuth,
  withError,
  withGroupAccess,
  withTranslations,
} from "@/app/lib/middlewares";
import { User } from "@/app/lib/definitions";
import { shoppingService } from "@/app/lib/db/services";

export const GET = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user }: { user: User }) => {
  const { searchParams } = new URL(req.url);

  const {
    groupId = null,
    id: shoppingId,
    ...query
  } = Object.fromEntries(Array.from(searchParams));

  if (shoppingId) {
    const data = await shoppingService.getOne(shoppingId, user);
    return NextResponse.json({ success: true, data }, { status: 200 });
  }

  const list = await shoppingService.getAll(user, groupId, query);

  return NextResponse.json(
    { success: true, data: list, message: "Shopping list fetched" },
    { status: 200 }
  );
});

export const POST = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user, payload }: { user: User; payload: any }) => {
  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const shopping = await shoppingService.create(user, payload);

  const message = t("created", {
    entity: te("scheduledPayment.nominative"),
    name: "",
  });

  return NextResponse.json(
    { success: true, data: shopping, message },
    { status: 200 }
  );
});

export const PATCH = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user, payload }: { user: User; payload: any }) => {
  const t = await withServerTranslations("Notifications");

  const shopping = await shoppingService.updateOne(user, payload);

  return NextResponse.json(
    {
      success: true,
      data: shopping,
      message: t("shoppingList", {
        action: t("actionUpdated"),
        name: shopping.title,
      }),
    },
    { status: 200 }
  );
});

export const DELETE = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user, t }: { user: User; t: any }) => {
  const body = await req.json();

  const { ids } = body;

  await shoppingService.deleteMany(user, ids);

  return NextResponse.json(
    {
      success: true,
      data: null,
      message: t("shoppingList", {
        action: t("actionDeleted"),
        name: "",
      }),
    },
    { status: 200 }
  );
});
