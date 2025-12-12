"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { Shopping } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";

import ShoppingListStatus from "@/app/(private)/(shoppings)/_components/ShoppingListStatus";

import { UserViewItem } from "../components/UserViewItem";

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
        cell: ({ row }) => <UserViewItem user={row.original.createdBy} />,
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
