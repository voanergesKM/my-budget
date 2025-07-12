import React from "react";
import { useParams } from "next/navigation";

import { Shopping, ShoppingItem } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import { StatusBadge } from "@/app/ui/components/StatusBadge";

import { useToggleStatusMutation } from "../../hooks/useToggleStatusMutation";

const ShoppingListStatus = ({
  shopping,
  item,
}: {
  shopping: Shopping;
  item?: Pick<ShoppingItem, "id" | "title" | "completed">;
}) => {
  const params = useParams();
  const { currentPage, pageSize } = usePaginationParams();
  const groupId = params?.groupId as string;

  const shoppingListKey = [
    ...QueryKeys.shoppingList,
    groupId ?? "all",
    currentPage,
    pageSize,
  ];

  const { mutate, isPending } = useToggleStatusMutation([shoppingListKey]);

  const { _id, completed } = shopping;

  const status = item?.completed ?? completed;

  const handleToggleStatus = () => {
    mutate({
      shoppingId: _id,
      status: status,
      itemId: item?.id,
    });
  };

  return (
    <StatusBadge
      status={status ? "completed" : "in-progress"}
      loading={isPending}
      onClick={handleToggleStatus}
      label={item?.title}
    />
  );
};

export default ShoppingListStatus;
