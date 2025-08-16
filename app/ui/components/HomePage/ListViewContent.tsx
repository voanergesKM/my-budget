"use client";

import { useTranslations } from "next-intl";

import { Category, Group, Transaction, User } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";
import { getuserAvatarFallback } from "@/app/lib/utils/getuserAvatarFallback";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";
import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

import { categoryIcons } from "@/app/ui/icons/categories";

export const ListViewContent = ({
  item,
  rowActions,
}: {
  item: Transaction;
  rowActions: RowAction<Transaction>[];
}) => {
  const category = item.category as Category;

  const t = useTranslations("Table");

  const amount = getFormattedAmount(item.currency, item.amount);

  const IconComponent =
    categoryIcons[category.icon as keyof typeof categoryIcons];

  return (
    <CollapsibleItem
      title={
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
      }
      actions={rowActions}
      context={item}
      style={{ borderColor: category.color }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="font-semibold">{t("amount")}:</span>
          <span>{amount}</span>
        </div>

        <div className="flex gap-2">
          <span className="font-semibold">{t("category")}:</span>
          <span>{category.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">{t("createdBy")}:</span>
          <ShowcaseItem<User>
            data={item.createdBy}
            titleExpression={(user) => `${user.firstName} ${user.lastName}`}
            fallbackExpression={(user) => getuserAvatarFallback(user)}
            avatarExpression={(user) =>
              user.avatarURL || "/image-placeholder.avif"
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">{t("createdAt")}:</span>
          <span>{formatWithTime(item.createdAt)}</span>
        </div>

        {item.group && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("group")}:</span>
            <ShowcaseItem<Group>
              data={item.group}
              titleExpression={(group) => group.name}
              avatarExpression={(group) =>
                group.image || "/image-placeholder.avif"
              }
            />
          </div>
        )}

        {item.description && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("description")}:</span>
            <span>{item.description}</span>
          </div>
        )}
      </div>
    </CollapsibleItem>
  );
};
