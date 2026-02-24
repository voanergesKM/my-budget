import { useFormatter, useTranslations } from "next-intl";

import { formatDate, formatWithTime } from "@/app/lib/utils/dateUtils";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";
import ServiceRecordPopover from "@/app/ui/components/common/DataTable/components/ServiceRecordPopover";
import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";
import { StatusBadge, StatusType } from "@/app/ui/components/StatusBadge";

import { ScheduleRecordType, ServiceRecordType } from "@/app/lib/types/vehicle";

export default function ScheduleRecordListItem({
  item,
  rowActions,
}: {
  item: ScheduleRecordType;
  rowActions: RowAction<ScheduleRecordType>[];
}) {
  const tTable = useTranslations("Table");
  const tc = useTranslations("VehicleExpenseCategory");
  const format = useFormatter();

  return (
    <CollapsibleItem
      title={
        <div className="flex flex-row justify-between gap-0">
          <div className="flex w-fit flex-col gap-1">
            <div className={"flex items-center"}>
              <span className="inline-block origin-left scale-75 text-sm">
                {formatDate(item.createdAt, "short")}
              </span>
              <div className={"w-[100px]"}>
                <StatusBadge status={item.status as StatusType} />
              </div>
            </div>

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
          <span className="font-semibold">{tTable("triggerOdometer")}:</span>
          <span>{format.number(item.triggerOdometer!)} km</span>

          <span className="font-semibold">{tTable("triggerDate")}:</span>
          <span>{formatDate(item.triggerDate, "short")}</span>

          {/*<span className="font-semibold">{tTable("status")}:</span>*/}
          {/*<div className={"w-fit"}>*/}
          {/*  <StatusBadge status={item.status as StatusType} />*/}
          {/*</div>*/}

          {item.record && (
            <>
              <span className="font-semibold">{tTable("prevRecord")}:</span>
              <div className={"w-fit"}>
                <ServiceRecordPopover data={item.record as ServiceRecordType} />
              </div>
            </>
          )}

          {item.completedAt && (
            <>
              <span className="font-semibold">{tTable("completedAt")}:</span>
              <span>{formatDate(item.completedAt, "short")}</span>
            </>
          )}

          <span className="font-semibold">{tTable("createdAt")}:</span>
          <span>{formatWithTime(item.createdAt)}</span>
        </div>
        <div className={"flex items-center justify-between gap-2"}>
          <span className="font-semibold">{tTable("createdBy")}:</span>
          <UserViewItem user={item.createdBy} />
        </div>
      </div>
    </CollapsibleItem>
  );
}
