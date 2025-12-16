"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { Category } from "@/app/lib/definitions";
import { formatFullDate, formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { StatusBadge } from "@/app/ui/components/StatusBadge";

import { ScheduledPaymentType } from "@/app/lib/types";

import { CategoryViewItem } from "../components/CategoryViewItem";
import { GroupViewItem } from "../components/GroupViewItem";
import { UserViewItem } from "../components/UserViewItem";

export function useScheduledpaymentsColumns(): ColumnDef<ScheduledPaymentType>[] {
  const t = useTranslations("Table");

  return useMemo(() => {
    return [
      {
        accessorKey: "description",
        header: t("description"),
        cell: ({ row }) => row.original.description,
      },
      {
        accessorKey: "category",
        header: t("category"),
        cell: ({ row }) => {
          const category = row.original.category as Category;

          return <CategoryViewItem category={category} />;
        },
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
        meta: {
          className: "text-center w-[240px]",
        },
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => {
          const status = row.original.status;

          return <StatusBadge status={status} />;
        },
        meta: {
          className: "text-center w-[160px]",
        },
      },

      {
        accessorKey: "proceedDate",
        header: t("proceedDate"),
        cell: ({ row }) => formatFullDate(row.original.proceedDate),
        meta: {
          className: "text-center w-[180px]",
        },
      },
      {
        accessorKey: "createdBy",
        header: t("createdBy"),
        cell: ({ row }) => <UserViewItem user={row.original.createdBy} />,
      },

      {
        accessorKey: "group",
        header: t("group"),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <GroupViewItem group={row.original.group} />
          </div>
        ),

        meta: {
          className: "text-center",
        },
      },
      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ row }) => formatWithTime(row.original.createdAt),
        meta: {
          className: "text-center w-[220px]",
        },
      },
      {
        accessorKey: "updatedAt",
        header: t("updatedAt"),
        cell: ({ row }) => formatWithTime(row.original.updatedAt),
        meta: {
          className: "text-center w-[220px]",
        },
      },
    ];
  }, [t]);
}
