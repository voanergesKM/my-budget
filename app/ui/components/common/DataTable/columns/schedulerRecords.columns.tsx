"use client";

import { useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate, formatWithTime } from "@/app/lib/utils/dateUtils";

import ServiceRecordPopover from "@/app/ui/components/common/DataTable/components/ServiceRecordPopover";
import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";
import { StatusBadge, StatusType } from "@/app/ui/components/StatusBadge";

import { ScheduleRecordType, ServiceRecordType } from "@/app/lib/types/vehicle";

export function useScheduledRecordsColumns(): ColumnDef<ScheduleRecordType>[] {
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
        accessorKey: "triggerOdometer",
        header: t("triggerOdometer"),
        cell: ({ getValue }) =>
          getValue() ? `${format.number(getValue<number>())} km` : " - ",
      },

      {
        accessorKey: "triggerDate",
        header: t("triggerDate"),
        cell: ({ getValue }) =>
          getValue() ? formatDate(getValue() as string, "full") : " - ",
        meta: {
          className: "text-center w-[220px]",
        },
      },

      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => {
          const status = row.original.status as StatusType;

          return <StatusBadge status={status} />;
        },
        meta: {
          className: "text-center w-[160px]",
        },
      },

      {
        accessorKey: "record",
        header: t("prevRecord"),
        cell: ({ row, getValue }) => {
          const record = getValue() as ServiceRecordType;

          if (!record) return " - ";

          return <ServiceRecordPopover data={record} />;
        },
        meta: {
          className: "w-fit",
        },
      },

      {
        accessorKey: "completedAt",
        header: t("completedAt"),
        cell: ({ getValue }) =>
          getValue() ? formatWithTime(getValue() as string) : " - ",
        meta: {
          className: "text-center w-[220px]",
        },
      },

      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ getValue }) =>
          getValue() ? formatWithTime(getValue() as string) : " - ",
        meta: {
          className: "text-center w-[220px]",
        },
      },

      {
        accessorKey: "createdBy",
        header: t("createdBy"),
        cell: ({ row }) => <UserViewItem user={row.original.createdBy} />,
      },
    ];
  }, [t]);
}
