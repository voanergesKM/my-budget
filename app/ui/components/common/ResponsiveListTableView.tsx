"use client";

import { ColumnDef } from "@tanstack/react-table";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { DataTable } from "@/app/ui/components/common/DataTable";
import PaginationControls from "@/app/ui/components/common/Pagination";

type CommonData<T> = {
  list: T[];
  totalPages: number;
  hasMore: boolean;
};

type RowAction<T> = {
  label: string;
  Icon?: React.ElementType;
  onClick: (row: T) => void;
  disabled?: boolean | ((context: T) => boolean);
};

type BaseItem = {
  _id: string;
  title?: string;
};

type ResponsiveViewProps<T> = {
  data: CommonData<T>;
  rowActions: RowAction<T>[];
  RenderItem?: React.ComponentType<{ item: T; rowActions: RowAction<T>[] }>;
  columns: ColumnDef<T>[];
};

export default function ResponsiveListTableView<T extends BaseItem>(
  props: ResponsiveViewProps<T>
) {
  const { data, rowActions, RenderItem, columns } = props;

  const isMobile = useIsMobile();

  if (!data) return null;

  return isMobile ? (
    <ListView<T> data={data} RenderItem={RenderItem} rowActions={rowActions} />
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
  rowActions: RowAction<T>[];
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
  rowActions,
  RenderItem,
}: {
  data: CommonData<T>;
  rowActions: RowAction<T>[];
  RenderItem?: React.ComponentType<{ item: T; rowActions: RowAction<T>[] }>;
}) {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {data.list.map((item) => (
          <li key={item._id} className="text-[var(--text-primary)]">
            {RenderItem ? (
              <RenderItem item={item} rowActions={rowActions} />
            ) : (
              <span>{item.title}</span>
            )}
          </li>
        ))}
      </ul>
      <PaginationControls totalPages={data.totalPages} hasMore={data.hasMore} />
    </div>
  );
}
