"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeDollarSign, Edit2Icon, Trash2Icon } from "lucide-react";

import { PaginatedResponse, Transaction } from "@/app/lib/definitions";

import { Button } from "@/app/ui/shadcn/Button";
import { TabsContent } from "@/app/ui/shadcn/tabs";

import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { columns } from "@/app/ui/components/common/DataTable/columns/transactionsList";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useDeleteTransactionMutation } from "./hooks/useDeleteTransactionMutation";
import { ListViewContent } from "./ListViewContent";
import { TransactionDialog } from "./TransactionDialog";

type ContentProps = {
  origin: "outgoing" | "incoming";
  data: PaginatedResponse<Transaction> | undefined;
};

export const Content = ({ origin, data }: ContentProps) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const [editData, setEditData] = useState<Transaction | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteData, setDeleteData] = useState<Transaction | null>(null);

  const { mutate: deleteTransaction, isPending } = useDeleteTransactionMutation(
    () => {
      setDeleteData(null);
    }
  );

  const handleEdit = (transaction: Transaction) => {
    setEditData(transaction);
    setOpenDialog(true);
  };

  const handleOpenDialogChange = () => {
    setEditData(null);
    setOpenDialog(false);
  };

  const rowActions = [
    {
      label: "Edit",
      onClick: handleEdit,
      Icon: Edit2Icon,
    },
    {
      label: "Delete",
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
      <TransactionDialog
        initial={editData}
        open={openDialog}
        onOpenChange={handleOpenDialogChange}
      />

      <TabsContent value={origin} className="space-y-2">
        <Button onClick={() => setOpenDialog(true)}>
          <BadgeDollarSign /> Add transaction
        </Button>

        {data && (
          <ResponsiveListTableView<Transaction>
            data={data}
            rowActions={rowActions}
            columns={visibleColumns}
            RenderItem={ListViewContent}
          />
        )}
      </TabsContent>

      {deleteData && (
        <ConfirmationDialog<Transaction>
          open={Boolean(deleteData)}
          onClose={() => setDeleteData(null)}
          confirmationQusestion="Are you sure you want to delete this transaction?"
          onDecision={() => {
            deleteTransaction([deleteData?._id]);
          }}
          loading={isPending}
        />
      )}
    </>
  );
};
