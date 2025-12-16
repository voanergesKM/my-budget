"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { Category, Transaction } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { CategoryViewItem } from "../components/CategoryViewItem";
import { GroupViewItem } from "../components/GroupViewItem";
import { UserViewItem } from "../components/UserViewItem";

export function useTransactionColumns(): ColumnDef<Transaction>[] {
  const t = useTranslations("Table");

  return useMemo(
    () => [
      {
        accessorKey: "category",
        header: t("category"),
        cell: ({ row }) => {
          const category = row.original.category as Category;

          return <CategoryViewItem category={category} />;
        },
      },
      {
        accessorKey: "description",
        header: t("description"),
        cell: ({ row }) => row.original.description,
      },
      {
        accessorKey: "amount",
        header: t("amount"),
        cell: ({ row }) => {
          const amount = row.original.amount;
          const currency = row.original.currency;
          const formatted = getFormattedAmount(currency, amount);
          return <span>{formatted}</span>;
        },
      },
      {
        accessorKey: "createdBy",
        header: t("createdBy"),
        cell: ({ row }) => <UserViewItem user={row.original.createdBy} />,
      },
      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ row }) => formatWithTime(row.original.createdAt),
      },
      {
        accessorKey: "group",
        header: t("group"),
        cell: ({ row }) => <GroupViewItem group={row.original.group} />,
      },
      {
        accessorKey: "updatedAt",
        header: t("updatedAt"),
        cell: ({ row }) => formatWithTime(row.original.updatedAt),
      },
    ],
    [t]
  );
}
