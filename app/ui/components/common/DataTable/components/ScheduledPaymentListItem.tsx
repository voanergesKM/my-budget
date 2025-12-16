import { useTranslations } from "next-intl";

import { Category } from "@/app/lib/definitions";
import { formatFullDate } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";
import { StatusBadge } from "@/app/ui/components/StatusBadge";

import { ScheduledPaymentType } from "@/app/lib/types";

import { CategoryViewItem } from "./CategoryViewItem";
import { GroupViewItem } from "./GroupViewItem";
import { UserViewItem } from "./UserViewItem";

export default function ScheduledPaymentListItem({
  item,
  rowActions,
}: {
  item: ScheduledPaymentType;
  rowActions: RowAction<ScheduledPaymentType>[];
}) {
  const tTable = useTranslations("Table");

  const amount = getFormattedAmount(item.currency, item.amount);

  const category = item.category as Category;

  return (
    <CollapsibleItem
      title={item.description}
      actions={rowActions}
      context={item}
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-text-primary">
        <>
          <span className="font-semibold">{tTable("proceedDate")}:</span>
          <span>{formatFullDate(item.proceedDate)}</span>
        </>

        <>
          <span className="font-semibold">{tTable("amount")}:</span>
          <span>{amount}</span>
        </>

        <>
          <span className="font-semibold">{tTable("status")}:</span>
          <span>
            <StatusBadge status={item.status} />
          </span>
        </>

        {item.category && (
          <>
            <span className="font-semibold">{tTable("category")}:</span>
            <CategoryViewItem category={category} />
          </>
        )}

        {item.group && (
          <>
            <span className="font-semibold">{tTable("group")}:</span>
            <GroupViewItem group={item.group} />

            <span className="font-semibold">{tTable("createdBy")}:</span>
            <UserViewItem user={item.createdBy} />
          </>
        )}
      </div>
    </CollapsibleItem>
  );
}
