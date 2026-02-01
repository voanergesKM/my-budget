import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { Card, CardContent } from "@/app/ui/shadcn/Card";

import { useFieldRecordsColumns } from "@/app/ui/components/common/DataTable/columns/fuelRecords.columns";
import FuelRecordListItem from "@/app/ui/components/common/DataTable/components/FuelRecordListItem";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useVehicleFuelRecordsList } from "@/app/(private)/(vehicles)/_hooks/useVehicleFuelRecordsList";
import { FuelRecordType } from "@/app/lib/types/vehicle";

function FuelRecordsList({
  onDelete,
  onEdit,
}: {
  onDelete: (row: FuelRecordType) => void;
  onEdit: (row: FuelRecordType) => void;
}) {
  const { vehicleId } = useParams();

  const t = useTranslations("Table");

  const { data, isLoading } = useVehicleFuelRecordsList();

  const columns = useFieldRecordsColumns();

  const rowActions = [
    {
      label: t("edit"),
      onClick: (row: FuelRecordType) => {
        onEdit(row);
      },
      Icon: Edit2Icon,
    },
    {
      label: t("delete"),
      onClick: (row: FuelRecordType) => {
        onDelete(row);
      },
      Icon: Trash2Icon,
    },
  ];

  return (
    <div>
      <Card>
        <CardContent className={"px-6 py-6 md:max-w-[calc(100vw-362px)]"}>
          <ResponsiveListTableView<FuelRecordType>
            data={data?.data}
            rowActions={rowActions}
            columns={columns}
            RenderItem={FuelRecordListItem}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default FuelRecordsList;
