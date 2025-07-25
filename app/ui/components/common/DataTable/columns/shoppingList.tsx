"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Shopping, User } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/Avatar";

import ShoppingListStatus from "@/app/(private)/(shoppings)/_components/ShoppingListStatus";

export const columns: ColumnDef<Shopping>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => <Creator user={row.original.createdBy} />,
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

const Creator = ({ user }: { user: User }) => {
  const avatarFallback =
    (user?.firstName?.[0]?.toUpperCase() || "") +
    (user?.lastName?.[0]?.toUpperCase() || "");

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.avatarURL || "/image-placeholder.avif"} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      {user.firstName} {user.lastName}
    </div>
  );
};
