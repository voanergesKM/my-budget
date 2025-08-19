import { NextRequest, NextResponse } from "next/server";

import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { toggleShoppingStatus } from "@/app/lib/db/controllers/shoppingListController";
import { getUser } from "@/app/lib/db/controllers/userController";

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const t = await withServerTranslations("Notifications");

  const dbUser = await getUser(token);

  const item = await toggleShoppingStatus(payload, dbUser);

  return NextResponse.json(
    {
      success: true,
      data: item,
      message: t("shoppingList", {
        action: t("actionUpdated"),
        name: item.title,
      }),
    },
    { status: 200 }
  );
});
