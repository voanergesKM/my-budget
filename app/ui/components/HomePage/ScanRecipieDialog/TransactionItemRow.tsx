import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2Icon } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";
import { Skeleton } from "@/app/ui/shadcn/Skeleton";

type TransactionItemRowProps = {
  onDelete: (index: number) => void;
  form: any;
  index: number;
};

function TransactionItemRow({
  onDelete,
  form,
  index,
}: TransactionItemRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("flex flex-col gap-2 rounded-md border p-4")}
    >
      <div className="flex items-center gap-4">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <form.AppField name={`transactions[${index}].category`}>
            {(field: { CategoriesSelectField: React.FC }) => (
              <field.CategoriesSelectField />
            )}
          </form.AppField>

          <form.AppField name={`transactions[${index}].amount`}>
            {(field: { AmountField: React.FC }) => <field.AmountField />}
          </form.AppField>
        </div>

        <div className="flex flex-col items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              size="icon"
              className="h-8 w-8 flex-shrink-0 rounded-full p-1"
              aria-label="Toggle collapsible"
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>

          <Button
            size={"icon"}
            className="h-8 w-8 flex-shrink-0 rounded-full p-1"
            aria-label="Delete transaction"
            onClick={() => onDelete(index)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      <CollapsibleContent>
        <form.AppField name={`transactions[${index}].description`}>
          {(field: { TextAreaField: React.FC }) => (
            // @ts-ignore
            <field.TextAreaField label="Description" />
          )}
        </form.AppField>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default React.memo(TransactionItemRow);

export const TransactionItemPlaceholder = () => {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-md border p-4">
      <div className="flex items-center gap-4">
        <div className="flex w-full gap-4">
          <div className="w-full">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <Skeleton className="md-w-[250px] h-10 w-[150px] rounded-md" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
};
