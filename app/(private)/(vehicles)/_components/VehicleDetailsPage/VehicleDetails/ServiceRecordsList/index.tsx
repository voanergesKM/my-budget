import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { Card, CardContent } from "@/app/ui/shadcn/Card";

import { useServiceRecordsColumns } from "@/app/ui/components/common/DataTable/columns/serviceRecords.columns";
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
    <div>
      <Card>
        <CardContent className={"px-6 py-6 md:max-w-[calc(100vw-362px)]"}>
          <ResponsiveListTableView<ServiceRecordType>
            data={data}
            rowActions={rowActions}
            columns={columns}
            // RenderItem={FuelRecordListItem}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ServiceRecordsList;
