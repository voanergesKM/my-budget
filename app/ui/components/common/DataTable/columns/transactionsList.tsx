"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { Category, Group, Transaction, User } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";
import { getuserAvatarFallback } from "@/app/lib/utils/getuserAvatarFallback";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import { categoryIcons } from "@/app/ui/icons/categories";

export function useTransactionColumns(): ColumnDef<Transaction>[] {
  const t = useTranslations("Table");

  return useMemo(
    () => [
      {
        accessorKey: "category",
        header: t("category"),
        cell: ({ row }) => {
          const category = row.original.category as Category;
          const IconComponent =
            categoryIcons[category.icon as keyof typeof categoryIcons];

          return (
            <ShowcaseItem<Category>
              data={category}
              icon={
                <div
                  className="flex size-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: category.color }}
                >
                  <IconComponent className="size-4 text-text-primary" />
                </div>
              }
              titleExpression={(category) => category.name}
            />
          );
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
        cell: ({ row }) => (
          <ShowcaseItem<User>
            data={row.original.createdBy}
            titleExpression={(user) => `${user.firstName} ${user.lastName}`}
            fallbackExpression={(user) => getuserAvatarFallback(user)}
            avatarExpression={(user) =>
              user.avatarURL || "/image-placeholder.avif"
            }
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ row }) => formatWithTime(row.original.createdAt),
      },
      {
        accessorKey: "group",
        header: t("group"),
        cell: ({ row }) => (
          <ShowcaseItem<Group>
            data={row.original.group}
            titleExpression={(group) => group.name}
            avatarExpression={(group) =>
              group.image || "/image-placeholder.avif"
            }
          />
        ),
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
