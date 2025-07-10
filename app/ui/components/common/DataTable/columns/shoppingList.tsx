"use client";

import { Shopping } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Shopping>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => row.original.items.length,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => formatWithTime(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated Date",
    cell: ({ row }) => formatWithTime(row.original.updatedAt),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => row.original.createdBy.fullName,
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell: ({ row }) => (row.original.completed ? "Yes" : "No"),
    meta: {
      className: "text-center w-[140px]",
    },
  },
];
