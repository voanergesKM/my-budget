import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { useServiceRecordsColumns } from "@/app/ui/components/common/DataTable/columns/serviceRecords.columns";
import ServiceRecordListItem from "@/app/ui/components/common/DataTable/components/ServiceRecordListItem";
import Paper from "@/app/ui/components/common/Paper";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useVehicleServiceRecordsList } from "@/app/(private)/(vehicles)/_hooks/useVehicleServiceRecordsList";
import { ServiceRecordType } from "@/app/lib/types/vehicle";

function ServiceRecordsList({
  onDelete,
  onEdit,
}: {
  onDelete: (row: ServiceRecordType) => void;
  onEdit: (row: ServiceRecordType) => void;
}) {
  const { vehicleId } = useParams();

  const t = useTranslations("Table");

  const { data, isLoading } = useVehicleServiceRecordsList();

  const columns = useServiceRecordsColumns();

  const rowActions = [
    {
      label: t("edit"),
      onClick: (row: ServiceRecordType) => {
        onEdit(row);
      },
      Icon: Edit2Icon,
    },
    {
      label: t("delete"),
      onClick: (row: ServiceRecordType) => {
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
      <ResponsiveListTableView<ServiceRecordType>
        data={data}
        rowActions={rowActions}
        columns={columns}
        RenderItem={ServiceRecordListItem}
        isLoading={isLoading}
      />
    </Paper>
  );
}

export default ServiceRecordsList;
