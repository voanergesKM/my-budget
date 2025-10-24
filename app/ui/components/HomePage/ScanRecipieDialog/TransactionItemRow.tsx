import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Trash2Icon } from "lucide-react";

import { Transaction } from "@/app/lib/definitions";
import { cn } from "@/app/lib/utils/utils";

import { useCurrencyRates } from "@/app/lib/hooks/useCurrencyRates";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";
import { Skeleton } from "@/app/ui/shadcn/Skeleton";
import { Textarea } from "@/app/ui/shadcn/textarea";

import { TextField } from "@/app/ui/components/TextField";
import { UserCategoriesSelect } from "@/app/ui/components/UserCategoriesSelect";

type TransactionItemRowProps = {
  item: Partial<Transaction>;
  onDelete: (transientId: string) => void;
  onChange: (transientId: string, changes: Partial<Transaction>) => void;
};

export function TransactionItemRow({
  item,
  onDelete,
  onChange,
}: TransactionItemRowProps) {
  const tc = useTranslations("Common");

  const currencyRates = useCurrencyRates();

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete(item.transientId!);
  };

  const handleCategoryChange = (category: any | null | string) => {
    let categoryId = "";
    if (!category) categoryId = "";
    else if (typeof category === "string") categoryId = category;
    else if (typeof category === "object" && category._id)
      categoryId = category._id;

    onChange(item.transientId!, { category: categoryId });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = raw === "" ? 0 : Number(raw);
    const amountInBaseCurrency =
      parsed / currencyRates.rates[item.currency as string];

    onChange(item.transientId!, {
      amount: isNaN(parsed) ? 0 : parsed,
      amountInBaseCurrency: Number(amountInBaseCurrency.toFixed(2)),
    });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange(item.transientId!, { description: e.target.value });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("flex flex-col gap-2 rounded-md border p-4")}
    >
      <div className="flex items-center gap-4">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="w-full">
            <UserCategoriesSelect
              value={
                typeof item?.category === "object"
                  ? item.category._id
                  : item?.category || ""
              }
              onChange={handleCategoryChange}
            />
          </div>

          <TextField
            classes={{ root: "md:!w-[250px]", input: "md:h-[66px]" }}
            required
            type="number"
            name="amount"
            label={tc("inputs.amount")}
            value={item.amount || ""}
            onChange={handleAmountChange}
          />
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
            onClick={handleDelete}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      <CollapsibleContent>
        <Textarea
          name="description"
          value={item.description}
          onChange={handleDescriptionChange}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

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
