"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Shopping, User } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getuserAvatarFallback } from "@/app/lib/utils/getuserAvatarFallback";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import ShoppingListStatus from "@/app/[locale]/(private)/(shoppings)/_components/ShoppingListStatus";

export const columns: ColumnDef<Shopping>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ShoppingListStatus shopping={row.original} />,
    meta: {
      className: "text-center w-[140px]",
    },
  },
];
