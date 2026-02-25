"use client";

import { useTranslations } from "next-intl";

import { Category, Transaction } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";

import { CategoryViewItem } from "../common/DataTable/components/CategoryViewItem";
import { GroupViewItem } from "../common/DataTable/components/GroupViewItem";
import { UserViewItem } from "../common/DataTable/components/UserViewItem";

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

  return (
    <CollapsibleItem
      title={
        <div className="flex w-fit flex-col gap-1">
          <span className="ml-3 inline-block origin-left scale-75 text-sm">
            {formatWithTime(item.createdAt)}
          </span>
          <CategoryViewItem category={category} />
          <span className="inline-block origin-left scale-95 text-sm font-bold">
            {amount}
          </span>
        </div>
      }
      actions={rowActions}
      context={item}
      style={{ borderColor: category.color }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{t("createdBy")}:</span>
          <UserViewItem user={item.createdBy} />
        </div>

        {item.group && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("group")}:</span>
            <GroupViewItem group={item.group} />
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
