import { useFormatter, useTranslations } from "next-intl";

import { formatFullDate } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";
import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";

import { FuelRecordType } from "@/app/lib/types/vehicle";

export default function FuelRecordListItem({
  item,
  rowActions,
}: {
  item: FuelRecordType;
  rowActions: RowAction<FuelRecordType>[];
}) {
  const tTable = useTranslations("Table");
  const format = useFormatter();

  const amount = getFormattedAmount(item.currency, item.amount);
  const pricePerLiter = getFormattedAmount(
    item.currency,
    item.amount / item.liters
  );

  return (
    <CollapsibleItem
      title={
        <div className="flex items-center gap-2">
          {format.number(item.odometer)} km
          <span>{format.number(item.liters)} L</span>
        </div>
      }
      actions={rowActions}
      context={item}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 text-sm text-text-primary">
        <span className="font-semibold">{tTable("proceedDate")}:</span>
        <span>{formatFullDate(item.createdAt)}</span>

        <span className="font-semibold">{tTable("amount")}:</span>
        <span>{amount}</span>

        <span className="font-semibold">{tTable("pricePerLiter")}:</span>
        <span>{pricePerLiter}</span>

        <span className="font-semibold">{tTable("fullTank")}:</span>
        <span>{item.fullTank ? "✓" : "—"}</span>

        <span className="font-semibold">{tTable("location")}:</span>
        <span>{item.location}</span>

        {item.notes && (
          <>
            <span className="font-semibold">{tTable("notes")}:</span>
            <span>{item.notes}</span>
          </>
        )}

        <span className="font-semibold">{tTable("createdBy")}:</span>
        <UserViewItem user={item.createdBy} />
      </div>
    </CollapsibleItem>
  );
}
