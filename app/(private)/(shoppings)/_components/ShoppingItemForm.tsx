"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ChevronsDownUp } from "lucide-react";
import { v4 as uuid } from "uuid";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";

import { useAppForm } from "@/app/ui/components/Form";
import { useFocusFirstField } from "@/app/ui/components/Form/hooks/useFocusFirstField";

import { createShoppingItemSchema } from "@/app/lib/schema/shoppingList.schema";

export const AddShoppingItem = ({ form }: { form: any }) => {
  const t = useTranslations("Shoppings");

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <div
          className={
            "flex items-center justify-between text-lg text-text-primary"
          }
        >
          <span>{t("addProduct")}</span>
          <Button
            size="icon"
            className="h-8 w-8 flex-shrink-0 rounded-full p-1"
            aria-label="Toggle collapsible"
          >
            <ChevronsDownUp />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={"mt-3"}>
        <Card className="my-0 border bg-transparent">
          <CardContent className="space-y-2 p-4 xl:flex xl:flex-col xl:items-start xl:gap-4 xl:space-y-0">
            <ShoppingItemForm
              onAdd={(item: any) => {
                form.insertFieldValue("items", 0, {
                  ...item,
                  id: uuid(),
                  transaction: null,
                  // __initial: structuredClone(item), TODO: add snapshot to rollback changes
                });
              }}
            />
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

function ShoppingItemForm({ onAdd }: any) {
  const tv = useTranslations("FormValidations");

  const tInputs = useTranslations("Common.inputs");
  const tButtons = useTranslations("Common.buttons");

  const schema = createShoppingItemSchema(tv);

  const form = useAppForm({
    defaultValues: {
      id: uuid(),
      title: "",
      quantity: 0,
      unit: "pcs",
      completed: false,
      category: "",
      amount: 0,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      onAdd(value);
      form.reset();
    },
  });

  const firstFieldRef = useFocusFirstField(form);

  return (
    <form.AppForm>
      <form.AppField name="title">
        {(field) => <field.TextField label="Назва" ref={firstFieldRef} />}
      </form.AppField>

      <div className={"grid grid-cols-2 gap-4 xl:grid-cols-4"}>
        <form.AppField name={"category"}>
          {(field) => <field.CategoriesSelectField />}
        </form.AppField>

        <form.AppField name="quantity">
          {(field) => (
            <field.TextField
              label={tInputs("quantity")}
              type="number"
              inputMode="decimal"
            />
          )}
        </form.AppField>

        <form.AppField name="unit">
          {(field) => <field.UnitSelectorField />}
        </form.AppField>

        <form.AppField name={"amount"}>
          {(field) => <field.AmountField />}
        </form.AppField>
      </div>

      <div className={"flex w-full lg:justify-end"}>
        <form.SubmitButton
          label={tButtons("add")}
          size="sm"
          className={"flex-1 lg:flex-grow-0"}
        />
      </div>
    </form.AppForm>
  );
}
