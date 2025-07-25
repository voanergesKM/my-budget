import React from "react";
import { useParams } from "next/navigation";
import { Edit2Icon, Trash2Icon } from "lucide-react";

import { ShoppingItem } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { StatusBadge } from "@/app/ui/components/StatusBadge";

import { useToggleStatusMutation } from "../_hooks/useToggleStatusMutation";

interface ShoppingListItemProps {
  item: ShoppingItem;
  onDelete: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
  shoppingId?: string | undefined;
}

const ShoppingListItem = ({
  item,
  onDelete,
  onEdit,
  shoppingId,
}: ShoppingListItemProps) => {
  const rowActions = [
    {
      label: "Edit",
      onClick: onEdit,
      Icon: Edit2Icon,
    },
    {
      label: "Delete",
      onClick: onDelete,
      Icon: Trash2Icon,
    },
  ];

  return (
    <li className="text-[var(--text-primary)]">
      <CollapsibleItem
        title={<ShoppingItemStatus item={item} shoppingId={shoppingId} />}
        context={item}
        actions={rowActions}
      >
        <div>
          <span className="mr-2 font-bold">Unit:</span>
          <span>{item.unit}</span>
        </div>
        <div>
          <span className="mr-2 font-bold">Quantity:</span>
          <span>{item.quantity}</span>
        </div>
      </CollapsibleItem>
    </li>
  );
};

export default ShoppingListItem;

const ShoppingItemStatus = ({
  shoppingId,
  item,
}: {
  shoppingId?: string | undefined;
  item: Pick<ShoppingItem, "id" | "title" | "completed">;
}) => {
  const params = useParams();
  const { currentPage, pageSize } = usePaginationParams();
  const groupId = params?.groupId as string;

  const shoppingListKey = [
    QueryKeys.shoppingList,
    groupId ?? "all",
    currentPage,
    pageSize,
  ];

  const editShoppingKey = [
    ...QueryKeys.getCurrentShopping,
    shoppingId ?? "all",
  ];

  const { mutate, isPending } = useToggleStatusMutation([
    shoppingListKey,
    editShoppingKey,
  ]);

  const { id, completed: status, title } = item;

  const handleToggleStatus = () => {
    if (!shoppingId) return;

    mutate({
      shoppingId,
      status,
      itemId: id,
    });
  };

  return (
    <StatusBadge
      status={status ? "completed" : "in-progress"}
      loading={isPending}
      onClick={handleToggleStatus}
      label={title}
    />
  );
};
