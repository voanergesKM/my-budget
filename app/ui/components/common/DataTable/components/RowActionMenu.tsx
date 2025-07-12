import { MoreVertical } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";

export type RowAction<TData> = {
  label: string;
  onClick: (row: TData) => void;
  Icon?: React.ElementType;
  disabled?: boolean | ((row: TData) => boolean);
};

type RowActionMenuProps<TData> = {
  row: TData;
  rowActions: RowAction<TData>[];
};

function RowActionMenu<TData>({ row, rowActions }: RowActionMenuProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full p-0"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {rowActions.map((action) => {
          const isDisabled =
            typeof action.disabled === "function"
              ? action.disabled(row)
              : !!action.disabled;

          return (
            <DropdownMenuItem
              disabled={isDisabled}
              key={action.label}
              onClick={() => action.onClick(row)}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RowActionMenu;
