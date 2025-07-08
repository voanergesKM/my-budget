import React from "react";
import CollapsibleItem from "./common/CollapsibleItem";
import { ShoppingItem } from "@/app/lib/definitions";

interface ShoppingListItemProps {
  item: ShoppingItem;
  onDelete?: (item: ShoppingItem) => void;
  onEdit?: (item: ShoppingItem) => void;
}

const ShoppingListItem = ({ item, onDelete, onEdit }: ShoppingListItemProps) => {
  const handleDelete = () => {
    onDelete && onDelete(item);
  };

  const handleEdit = () => {
    onEdit && onEdit(item);
  };

  return (
    <li className="text-[var(--text-primary)]">
      <CollapsibleItem title={item.title} onDelete={handleDelete} onEdit={handleEdit}>
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
