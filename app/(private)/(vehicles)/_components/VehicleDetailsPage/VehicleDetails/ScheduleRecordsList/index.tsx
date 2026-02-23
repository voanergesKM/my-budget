import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { useScheduledRecordsColumns } from "@/app/ui/components/common/DataTable/columns/schedulerRecords.columns";
import ScheduleRecordListItem from "@/app/ui/components/common/DataTable/components/ScheduleRecordListItem";
import Paper from "@/app/ui/components/common/Paper";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useVehicleSchedulesRecordsList } from "@/app/(private)/(vehicles)/_hooks/useVehicleSchedulesRecordsList";
import { ScheduleRecordType } from "@/app/lib/types/vehicle";

function ScheduleRecordsList({
  onDelete,
  onEdit,
}: {
  onDelete: (row: ScheduleRecordType) => void;
  onEdit: (row: ScheduleRecordType) => void;
}) {
  const { vehicleId } = useParams();

  const t = useTranslations("Table");

  const { data, isLoading } = useVehicleSchedulesRecordsList();

  const columns = useScheduledRecordsColumns();

  const rowActions = [
    {
      label: t("edit"),
      onClick: (row: ScheduleRecordType) => {
        onEdit(row);
      },
      Icon: Edit2Icon,
    },
    {
      label: t("delete"),
      onClick: (row: ScheduleRecordType) => {
        onDelete(row);
      },
      Icon: Trash2Icon,
    },
  ];

  return (
    <Paper
      className={
        "mb-10 md:max-w-[calc(100vw-352px)] xl:mb-0 xl:max-w-[calc(100vw-362px)]"
      }
    >
      <ResponsiveListTableView<ScheduleRecordType>
        data={data}
        rowActions={rowActions}
        columns={columns}
        RenderItem={ScheduleRecordListItem}
        isLoading={isLoading}
      />
    </Paper>
  );
}

export default ScheduleRecordsList;
