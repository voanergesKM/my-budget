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
import { Badge } from "../shadcn/Badge";
import {
  AlertCircleIcon,
  CheckIcon,
  DeleteIcon,
  Edit2Icon,
  Icon,
  Trash2Icon,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { formatWithTime } from "@/app/lib/utils/dateUtils";

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
          RenderItem={({ item }) => <ListViewContent item={item} />}
        />
      )}
    </>
  );
}

function ListViewContent({ item }: { item: Shopping }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-text-primary">
      <span className="font-semibold">Date:</span>
      <span>{formatWithTime(item.createdAt)}</span>

      <span className="font-semibold">Created by:</span>
      <span>{item.createdBy?.fullName ?? "Unknown"}</span>

      <span className="font-semibold">Status:</span>
      <span>
        <StatusBadge
          status={item.completed ? "completed" : "in-progress"}
          key={item._id}
        />
      </span>

      {item.category && (
        <>
          <span className="font-semibold">Category:</span>
          <span>{item.category}</span>
        </>
      )}

      {item.group?.name && (
        <>
          <span className="font-semibold">Group:</span>
          <span>{item.group.name}</span>
        </>
      )}

      {item.items?.length > 0 && (
        <>
          <span className="font-semibold">Items:</span>
          <span className="flex flex-wrap gap-2">
            {item.items.map(({ id, title, completed }) => (
              <StatusBadge
                key={id}
                status={completed ? "completed" : "in-progress"}
                label={title}
              />
            ))}
          </span>
        </>
      )}
    </div>
  );
}
