import React, { memo, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { Category, PaginatedResponse } from "@/app/lib/definitions";

import { useGroupIdFromSearchParams } from "@/app/lib/hooks/useGroupIdFromSearchParams";

import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { useScheduledpaymentsColumns } from "@/app/ui/components/common/DataTable/columns/scheduledPayments.columns";
import ScheduledPaymentListItem from "@/app/ui/components/common/DataTable/components/ScheduledPaymentListItem";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { ScheduledPaymentType } from "@/app/lib/types";

import { useDeleteScheduledPaymentMutation } from "../hooks/useDeleteScheduledPaymentMutation";

type ScheduledPaymentsListProps = {
  data: PaginatedResponse<ScheduledPaymentType> | undefined;
  setDialogData: (data: ScheduledPaymentType) => void;
  isLoading?: boolean;
};

function ScheduledPaymentsList({
  data,
  isLoading,
  setDialogData,
}: ScheduledPaymentsListProps) {
  const groupId = useGroupIdFromSearchParams();

  const t = useTranslations("Table");
  const td = useTranslations("Dialogs");

  const [deleteData, setDeleteData] = useState<ScheduledPaymentType | null>(
    null
  );

  const { mutate: onDelete, isPending } = useDeleteScheduledPaymentMutation(
    () => {
      setDeleteData(null);
    }
  );

  const rowActions = [
    {
      label: t("edit"),
      onClick: (row: ScheduledPaymentType) => {
        const editData = normalizeData(row);

        setDialogData(editData);
      },
      Icon: Edit2Icon,
    },
    {
      label: t("delete"),
      onClick: (row: ScheduledPaymentType) => {
        setDeleteData(row);
      },
      Icon: Trash2Icon,
    },
  ];

  const columns = useScheduledpaymentsColumns();

  const visibleColumns = useMemo(
    () =>
      groupId
        ? // @ts-ignore
          columns.filter((col) => col.accessorKey !== "group")
        : // @ts-ignore
          columns.filter((col) => col.accessorKey !== "createdBy"),
    [columns, groupId]
  );

  return (
    <div className="mt-6">
      <ResponsiveListTableView<ScheduledPaymentType>
        data={data}
        rowActions={rowActions}
        columns={visibleColumns}
        RenderItem={ScheduledPaymentListItem}
        isLoading={isLoading}
      />

      <ConfirmationDialog<ScheduledPaymentType>
        open={Boolean(deleteData)}
        onClose={() => setDeleteData(null)}
        confirmationQusestion={td("deleteScheduledPaymentMessage")}
        onDecision={() => {
          onDelete([deleteData!._id]);
        }}
        loading={isPending}
      />
    </div>
  );
}

export default memo(ScheduledPaymentsList);

function normalizeData(data: ScheduledPaymentType) {
  const { category, ...paymentData } = data;
  const categoryObject = category as Category;

  return {
    ...paymentData,
    category: categoryObject._id,
  };
}
