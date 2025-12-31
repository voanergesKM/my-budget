import React from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";
import { ChevronsDownUp, Trash2 } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";

import { StatusBadge } from "@/app/ui/components/StatusBadge";

interface ShoppingListItemProps {
  form: any;
  index: number;
}

const ShoppingListItem = ({ form, index }: ShoppingListItemProps) => {
  const tInputs = useTranslations("Common.inputs");
  const tUnits = useTranslations("Units");

  const item = useStore(form.store, (state: any) => state.values.items[index]);

  return (
    <li className="rounded border p-3 text-[var(--text-primary)]">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className={"flex items-center justify-between"}>
            <div className={"flex items-center gap-3"}>
              <Button
                size="icon"
                className="h-8 w-8 flex-shrink-0 rounded-full p-1"
                aria-label="Toggle collapsible"
              >
                <ChevronsDownUp />
              </Button>

              <div
                className={"flex flex-col md:flex-row md:gap-3"}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-medium">{item.title}</span>
                <div className="flex items-center gap-2">
                  <span className="opacity-70">
                    {item.quantity} {tUnits(item.unit)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={"flex flex-shrink-0 items-center justify-end gap-3"}
            >
              <form.AppField name={`items[${index}].completed`}>
                {(field: any) => (
                  <StatusBadge
                    status={field.state.value ? "completed" : "in-progress"}
                    onClick={() => {
                      field.handleChange(!field.state.value);
                    }}
                  />
                )}
              </form.AppField>

              <Button
                size="icon"
                variant={"ghost"}
                className="rounded-full p-1"
                onClick={(event) => {
                  event.stopPropagation();
                  form.removeFieldValue("items", index);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <form.AppField name={`items[${index}].title`}>
            {(field: any) => <field.TextField label={tInputs("title")} />}
          </form.AppField>
          <div className={"grid grid-cols-2 gap-4 xl:grid-cols-4"}>
            <form.AppField name={`items[${index}].category`}>
              {(field: any) => <field.CategoriesSelectField />}
            </form.AppField>

            <form.AppField name={`items[${index}].quantity`}>
              {(field: any) => (
                <field.TextField
                  label={tInputs("quantity")}
                  type="number"
                  inputMode="decimal"
                />
              )}
            </form.AppField>

            <form.AppField name={`items[${index}].unit`}>
              {(field: any) => <field.UnitSelectorField />}
            </form.AppField>

            <form.AppField name={`items[${index}].amount`}>
              {(field: any) => <field.AmountField />}
            </form.AppField>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
};

export default React.memo(ShoppingListItem);
