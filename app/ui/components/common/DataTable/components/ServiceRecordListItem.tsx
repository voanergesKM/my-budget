import { useFormatter, useTranslations } from "next-intl";

import { formatDate } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";
import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";

import { ServiceRecordType } from "@/app/lib/types/vehicle";

export default function ServiceRecordListItem({
  item,
  rowActions,
}: {
  item: ServiceRecordType;
  rowActions: RowAction<ServiceRecordType>[];
}) {
  const tTable = useTranslations("Table");
  const tc = useTranslations("VehicleExpenseCategory");
  const format = useFormatter();

  const amount = getFormattedAmount(item.currency, item.amount);

  return (
    <CollapsibleItem
      title={
        <div className="flex flex-row justify-between gap-1">
          <div className="flex w-fit flex-col gap-1">
            <span className="inline-block origin-left scale-75 text-sm">
              {formatDate(item.createdAt, "short")}
            </span>
            <span className="inline-block origin-left scale-95 text-sm font-bold">
              {item.title}
            </span>
            <span className="inline-block origin-left scale-95 text-sm">
              {tc(item.category)}
            </span>
          </div>
        </div>
      }
      actions={rowActions}
      context={item}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 text-sm text-text-primary">
          <span className="font-semibold">{tTable("odometer")}:</span>
          <span>{format.number(item.odometer!)} km</span>

          <span className="font-semibold">{tTable("amount")}:</span>
          <span>{amount}</span>
          {item.notes && (
            <>
              <span className="font-semibold">{tTable("notes")}:</span>
              <span>{item.notes}</span>
            </>
          )}
        </div>
        <div className={"flex items-center justify-between gap-2"}>
          <span className="font-semibold">{tTable("createdBy")}:</span>
          <UserViewItem user={item.createdBy} />
        </div>
      </div>
    </CollapsibleItem>
  );
}
