import { useTranslations } from "next-intl";

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
  const tTable = useTranslations("Table");

  return (
    <CollapsibleItem title={item.title} actions={rowActions} context={item}>
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-text-primary">
        <span className="font-semibold">{tTable("createdAt")}:</span>
        <span>{formatWithTime(item.createdAt)}</span>

        <span className="font-semibold">{tTable("createdBy")}:</span>
        <span>{item.createdBy?.fullName ?? "Unknown"}</span>

        <span className="font-semibold">{tTable("status")}:</span>
        <span>
          <ShoppingListStatus shopping={item} />
        </span>

        {item.group?.name && (
          <>
            <span className="font-semibold">{tTable("group")}:</span>
            <span>{item.group.name}</span>
          </>
        )}

        {item.items?.length > 0 && (
          <>
            <span className="font-semibold">{tTable("items")}:</span>
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
