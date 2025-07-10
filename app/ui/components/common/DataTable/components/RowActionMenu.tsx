import { Button } from "@/app/ui/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";
import { MoreVertical } from "lucide-react";

export type RowAction<TData> = {
  label: string;
  onClick: (row: TData) => void;
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
        {rowActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={() => action.onClick(row)}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RowActionMenu;
