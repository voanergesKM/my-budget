"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { Shopping } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import Button from "@/app/ui/components/Button";
import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { columns } from "@/app/ui/components/common/DataTable/columns/shoppingList";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useDeleteShoppingsMutation } from "../hooks/useDeleteShoppingsMutation";

import ListViewContent from "./components/ListViewContent";

export default function ShoppingList() {
  const params = useParams();
  const router = useRouter();

  const { currentPage, pageSize } = usePaginationParams();

  const [deleteData, setDeleteData] = useState<Shopping | null>(null);

  const groupId = params?.groupId as string;

  const shoppingListKey = [
    ...QueryKeys.shoppingList,
    groupId ?? "all",
    currentPage,
    pageSize,
  ];

  const { data } = useQuery({
    queryKey: shoppingListKey,
    queryFn: () => getShoppingsList(groupId, currentPage, pageSize),
  });

  const { mutate, isPending } = useDeleteShoppingsMutation(
    shoppingListKey,
    () => {
      setDeleteData(null);
    }
  );

  const handleCreate = () => {
    const location = groupId
      ? `/shopping/create/${groupId}`
      : "/shopping/create";
    router.push(location);
  };

  const handleEdit = (row: Shopping) => {
    router.push(`/shopping/update/${row._id}`);
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

  return (
    <>
      <div className="my-4 w-[150px]">
        <Button onClick={handleCreate}>Create List</Button>
      </div>

      {deleteData && (
        <ConfirmationDialog<Shopping>
          open={Boolean(deleteData)}
          onClose={() => setDeleteData(null)}
          confirmationQusestion="Are you sure you want to delete this list?"
          onDecision={() => {
            mutate([deleteData?._id]);
          }}
          data={deleteData}
          renderItems={(data) => data?.title}
          loading={isPending}
        />
      )}

      {data && (
        <ResponsiveListTableView<Shopping>
          data={data}
          rowActions={rowActions}
          columns={columns}
          RenderItem={ListViewContent}
        />
      )}
    </>
  );
}
