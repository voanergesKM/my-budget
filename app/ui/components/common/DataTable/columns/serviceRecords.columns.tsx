"use client";

import { useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";

import { ServiceRecordType } from "@/app/lib/types/vehicle";

export function useServiceRecordsColumns(): ColumnDef<ServiceRecordType>[] {
  const t = useTranslations("Table");
  const tc = useTranslations("VehicleExpenseCategory");

  const format = useFormatter();

  return useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: t("title"),
        cell: ({ getValue }) => getValue(),
      },

      {
        accessorKey: "category",
        header: t("category"),
        cell: ({ row }) => tc(row.original.category) || "—",
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
        accessorKey: "odometer",
        header: t("odometer"),
        cell: ({ getValue }) => `${format.number(getValue<number>())} km`,
      },

      {
        accessorKey: "notes",
        header: t("notes"),
        cell: ({ getValue }) => getValue() || "—",
      },

      {
        accessorKey: "transaction",
        header: t("transaction"),
        cell: ({ getValue }) => (getValue() ? "✓" : "—"),
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
        meta: {
          className: "text-center w-[220px]",
        },
      },

      // {
      //   accessorKey: "updatedAt",
      //   header: t("updatedAt"),
      //   cell: ({ row }) => formatWithTime(row.original.updatedAt),
      //   meta: {
      //     className: "text-center w-[220px]",
      //   },
      // },
    ];
  }, [t]);
}
