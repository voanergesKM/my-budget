import { useFormatter, useTranslations } from "next-intl";

import { formatDate } from "@/app/lib/utils/dateUtils";
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
        <div className="flex flex-row justify-between gap-1">
          <div className="flex w-fit flex-col gap-1">
            <span className="inline-block origin-left scale-75 text-sm">
              {formatDate(item.createdAt, "short")}
            </span>
            <span className="inline-block origin-left scale-95 text-sm font-bold">
              {amount}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="scale-85 inline-block origin-left text-sm">
              {format.number(item.odometer)} km
            </span>
            <span className="inline-block origin-left scale-75 text-sm">
              {item.trip > 0 && `+${format.number(item.trip)} km`}
            </span>
          </div>
        </div>
      }
      actions={rowActions}
      context={item}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 text-sm text-text-primary">
          {!!item.consumption && (
            <>
              <span className="font-semibold">{tTable("consumption")}:</span>
              <span>{item.consumption.toFixed(2)} l/100km</span>
            </>
          )}

          {item.fullTank && !item.isMissed && item.consumption > 0 && (
            <>
              <span className="font-semibold">{tTable("kmPerLiter")}:</span>
              <span>
                {format.number(100 / item.consumption, {
                  maximumFractionDigits: 2,
                })}{" "}
                km/L
              </span>
            </>
          )}

          <span className="font-semibold">{tTable("liters")}:</span>
          <span>{item.liters}l</span>

          <span className="font-semibold">{tTable("pricePerLiter")}:</span>
          <span>{pricePerLiter}</span>

          <span className="font-semibold">{tTable("fullTank")}:</span>
          <span>{item.fullTank ? "✓" : "—"}</span>

          {!!item.city && (
            <>
              <span className="font-semibold">{tTable("city")}:</span>
              <span>{item.city}</span>
            </>
          )}

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
