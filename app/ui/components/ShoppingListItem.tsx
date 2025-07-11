import React from "react";
import CollapsibleItem from "./common/CollapsibleItem";
import { ShoppingItem } from "@/app/lib/definitions";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ShoppingListItemProps {
  item: ShoppingItem;
  onDelete: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem) => void;
}

const ShoppingListItem = ({
  item,
  onDelete,
  onEdit,
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
        title={
          <StatusBadge
            status={item.completed ? "completed" : "in-progress"}
            label={item.title}
          />
        }
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
