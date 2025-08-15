import { Shopping } from "@/app/lib/definitions";
import { formatWithTime } from "@/app/lib/utils/dateUtils";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";

import ShoppingListStatus from "./ShoppingListStatus";

export default function ListViewContent({
  item,
  rowActions,
}: {
  item: Shopping;
  rowActions: RowAction<Shopping>[];
}) {
  return (
    <CollapsibleItem title={item.title} actions={rowActions} context={item}>
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-text-primary">
        <span className="font-semibold">Date:</span>
        <span>{formatWithTime(item.createdAt)}</span>

        <span className="font-semibold">Created by:</span>
        <span>{item.createdBy?.fullName ?? "Unknown"}</span>

        <span className="font-semibold">Status:</span>
        <span>
          <ShoppingListStatus shopping={item} />
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
                <ShoppingListStatus
                  key={id}
                  shopping={item}
                  item={{ id, title, completed }}
                />
              ))}
            </span>
          </>
        )}
      </div>
    </CollapsibleItem>
  );
}
