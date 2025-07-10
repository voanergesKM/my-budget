"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useIsMobile } from "@/app/lib/hooks/use-mobile";
import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { DataTable } from "@/app/ui/components/common/DataTable";
import PaginationControls from "@/app/ui/components/common/Pagination";

type CommonData<T> = {
  list: T[];
  totalPages: number;
  hasMore: boolean;
};

type RowAction<T> = {
  label: string;
  onClick: (item: T) => void;
};

type BaseItem = {
  _id: string;
  title: string;
};

type ResponsiveViewProps<T> = {
  data: CommonData<T>;
  rowActions?: RowAction<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  columns: ColumnDef<T>[];
};

export default function ResponsiveListTableView<T extends BaseItem>(
  props: ResponsiveViewProps<T>
) {
  const { data, rowActions, onEdit, onDelete, renderItem, columns } = props;

  const isMobile = useIsMobile();

  if (!data) return null;

  return isMobile ? (
    <ListView<T>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      renderItem={renderItem}
    />
  ) : (
    <TableView<T> data={data} rowActions={rowActions} columns={columns} />
  );
}

function TableView<T>({
  data,
  rowActions,
  columns,
}: {
  data: CommonData<T>;
  rowActions?: RowAction<T>[];
  columns: ColumnDef<T>[];
}) {
  return (
    <DataTable
      columns={columns}
      data={data.list}
      rowActions={rowActions}
      pageCount={data.totalPages}
      hasMore={data.hasMore}
    />
  );
}

function ListView<T extends BaseItem>({
  data,
  onEdit,
  onDelete,
  renderItem,
}: {
  data: CommonData<T>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {data.list.map((item) => (
          <li key={item._id} className="text-[var(--text-primary)]">
            <CollapsibleItem
              title={item.title}
              onEdit={onEdit ? () => onEdit(item) : undefined}
              onDelete={onDelete ? () => onDelete(item) : undefined}
            >
              {renderItem ? renderItem(item) : <span>{item.title}</span>}
            </CollapsibleItem>
          </li>
        ))}
      </ul>
      <PaginationControls totalPages={data.totalPages} hasMore={data.hasMore} />
    </div>
  );
}
