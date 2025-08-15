"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { Shopping, User } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getuserAvatarFallback } from "@/app/lib/utils/getuserAvatarFallback";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import ShoppingListStatus from "@/app/(private)/(shoppings)/_components/ShoppingListStatus";

export const useShoppingListColumns = (): ColumnDef<Shopping>[] => {
  const t = useTranslations("Table");

  return useMemo(
    () => [
      {
        accessorKey: "title",
        header: t("shoppingTitle"),
      },
      {
        accessorKey: "createdBy",
        header: t("createdBy"),
        cell: ({ row }) => (
          <ShowcaseItem<User>
            data={row.original.createdBy}
            titleExpression={(user) => `${user.firstName} ${user.lastName}`}
            fallbackExpression={(user) => getuserAvatarFallback(user)}
            avatarExpression={(user) => user.avatarURL}
          />
        ),
      },
      {
        accessorKey: "items",
        header: t("items"),
        cell: ({ row }) => row.original.items.length,
      },
      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ row }) => formatWithTime(row.original.createdAt),
      },
      {
        accessorKey: "updatedAt",
        header: t("updatedAt"),
        cell: ({ row }) => formatWithTime(row.original.updatedAt),
      },

      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => <ShoppingListStatus shopping={row.original} />,
        meta: {
          className: "text-center w-[140px]",
        },
      },
    ],
    [t]
  );
};
