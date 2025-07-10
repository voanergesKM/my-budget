"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/app/ui/components/Button";
import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { Shopping } from "@/app/lib/definitions";
import { columns } from "@/app/ui/components/common/DataTable/columns/shoppingList";
import { deleteShoppings } from "@/app/lib/api/shoppings/deleteShoppings";
import Notify from "@/app/lib/utils/notify";
import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

export default function ShoppingList() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { currentPage, pageSize } = usePaginationParams();

  const [deleteData, setDeleteData] = useState<Shopping | null>(null);

  const groupId = params?.groupId as string;

  const shoppingListKey = [
    "shoppingList",
    groupId ?? "all",
    currentPage,
    pageSize,
  ];

  const { data } = useQuery({
    queryKey: shoppingListKey,
    queryFn: () => getShoppingsList(groupId, currentPage, pageSize),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteShoppings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey });
      setDeleteData(null);
      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });

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
    },
    {
      label: "Delete",
      onClick: setDeleteData,
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
          onEdit={handleEdit}
          onDelete={setDeleteData}
          columns={columns}
          renderItem={(item) => (
            <div>
              <p>{item.title}</p>
              <small>{item.createdAt}</small>
            </div>
          )}
        />
      )}
    </>
  );
}
