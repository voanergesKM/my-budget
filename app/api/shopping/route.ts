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

export const PATCH = compose(
  withError,
  withTranslations("Notifications"),
  withAuth,
  withGroupAccess
)(async (req: NextRequest, { user, payload }: { user: User; payload: any }) => {
  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const shopping = await shoppingService.updateStatus(user, payload);

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
