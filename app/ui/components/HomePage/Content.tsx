"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { PaginatedResponse, Transaction } from "@/app/lib/definitions";

import { TabsContent } from "@/app/ui/shadcn/tabs";

import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { useTransactionColumns } from "@/app/ui/components/common/DataTable/columns/transactionsList";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useDeleteTransactionMutation } from "./hooks/useDeleteTransactionMutation";
import { ListViewContent } from "./ListViewContent";

type ContentProps = {
  origin: "outgoing" | "incoming";
  data: PaginatedResponse<Transaction> | undefined;
  onEdit: (data: Transaction) => void;
  isLoading?: boolean;
};

export const Content = ({ origin, data, onEdit, isLoading }: ContentProps) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const t = useTranslations("Table");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");

  const [deleteData, setDeleteData] = useState<Transaction | null>(null);

  const columns = useTransactionColumns();

  const { mutate: deleteTransaction, isPending } = useDeleteTransactionMutation(
    () => {
      setDeleteData(null);
    }
  );

  const rowActions = [
    {
      label: t("edit"),
      onClick: onEdit,
      Icon: Edit2Icon,
    },
    {
      label: t("delete"),
      onClick: setDeleteData,
      Icon: Trash2Icon,
    },
  ];

  const visibleColumns = groupId
    ? columns
    : // @ts-ignore
      columns.filter((col) => col.accessorKey !== "Group");

  return (
    <>
      <TabsContent value={origin} className="space-y-2">
        <ResponsiveListTableView<Transaction>
          data={data}
          rowActions={rowActions}
          columns={visibleColumns}
          RenderItem={ListViewContent}
          isLoading={isLoading}
        />
      </TabsContent>

      {deleteData && (
        <ConfirmationDialog<Transaction>
          open={Boolean(deleteData)}
          onClose={() => setDeleteData(null)}
          confirmationQusestion={td("confirmationMessage", {
            entity: te("transaction.accusative"),
          })}
          onDecision={() => {
            deleteTransaction([deleteData?._id]);
          }}
          loading={isPending}
        />
      )}
    </>
  );
};
