"use client";

import { useTranslations } from "next-intl";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/app/lib/utils/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/shadcn/Table";

import PaginationControls from "@/app/ui/components/common/Pagination";

import RowActionMenu, { RowAction } from "./components/RowActionMenu";

type ColumnMeta = {
  className?: string;
};

type ColumnDefWithMeta<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: ColumnMeta;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDefWithMeta<TData, TValue>[];
  data: TData[];
  rowActions?: RowAction<TData>[];
  pageCount: number;
  hasMore: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowActions,
  pageCount,
  hasMore,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("Table");

  const actionColumn: ColumnDef<TData> | null = rowActions?.length
    ? {
        id: "actions",
        header: t("actions"),
        cell: ({ row }) => (
          <RowActionMenu<TData> row={row.original} rowActions={rowActions} />
        ),
        meta: {
          className: "text-center w-[105px]",
        },
      }
    : null;

  const table = useReactTable({
    data,
    columns: actionColumn ? [...columns, actionColumn] : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    manualPagination: true,
    pageCount: pageCount,
  });

  return (
    <div>
      <div className="overflow-auto overflow-y-auto rounded-md border">
        <Table className="text-text-primary">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "text-xl text-text-primary",
                        (header.column.columnDef.meta as ColumnMeta)
                          ?.className || ""
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.columnDef.meta as ColumnMeta)?.className ||
                          ""
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls totalPages={pageCount} hasMore={hasMore} />
    </div>
  );
}
