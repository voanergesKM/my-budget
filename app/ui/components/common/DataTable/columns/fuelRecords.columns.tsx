"use client";

import { useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";

import { FuelRecordType } from "@/app/lib/types/vehicle";

export function useFieldRecordsColumns(): ColumnDef<FuelRecordType>[] {
  const t = useTranslations("Table");
  const format = useFormatter();

  return useMemo(() => {
    return [
      {
        accessorKey: "odometer",
        header: t("odometer"),
        cell: ({ getValue }) => `${format.number(getValue<number>())} km`,
      },
      {
        id: "location",
        header: t("location"),
        cell: ({ row }) => {
          const { location, station } = row.original;
          return [location].filter(Boolean).join(", ");
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
        accessorKey: "liters",
        header: t("liters"),
        cell: ({ getValue }) => `${getValue()} L`,
      },
      {
        accessorKey: "consumption",
        header: t("consumption"),
        cell: ({ getValue }) => `${getValue() ? `${getValue()} L/100km` : "—"}`,
      },
      {
        id: "pricePerLiter",
        header: t("pricePerLiter"),
        cell: ({ row }) => {
          const { amount, liters } = row.original;
          return (amount / liters).toFixed(2);
        },
      },
      {
        accessorKey: "fullTank",
        header: t("fullTank"),
        cell: ({ getValue }) => (getValue() ? "✓" : "—"),
      },

      // {
      //   accessorKey: "isMissed",
      //   header: "missed",
      //   cell: ({ getValue }) => (getValue() ? "⚠️" : ""),
      // },
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
