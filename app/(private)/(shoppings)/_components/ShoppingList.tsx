"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { Shopping } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import Button from "@/app/ui/components/Button";
import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";
import { useShoppingListColumns } from "@/app/ui/components/common/DataTable/columns/shoppingList";
import ResponsiveListTableView from "@/app/ui/components/common/ResponsiveListTableView";

import { useDeleteShoppingsMutation } from "../_hooks/useDeleteShoppingsMutation";

import ListViewContent from "./ListViewContent";

export default function ShoppingList() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || undefined;

  const { currentPage, pageSize } = usePaginationParams();

  const t = useTranslations("Table");

  const [deleteData, setDeleteData] = useState<Shopping | null>(null);

  const columns = useShoppingListColumns();

  const shoppingListKey = [
    QueryKeys.shoppingList,
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
      ? `/shopping/create?groupId=${groupId}`
      : "/shopping/create";
    router.push(location);
  };

  const handleEdit = (row: Shopping) => {
    const location = groupId
      ? `/shopping/update/${row._id}?groupId=${groupId}`
      : `/shopping/update/${row._id}`;

    router.push(location);
  };

  const rowActions = [
    {
      label: t("edit"),
      onClick: handleEdit,
      Icon: Edit2Icon,
    },
    {
      label: t("delete"),
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
