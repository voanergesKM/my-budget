"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Shopping } from "@/app/lib/definitions";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { useDefaultCurrency } from "@/app/lib/hooks/useDefaultCurrency";

import { FieldError } from "@/app/ui/shadcn/Field";

import { useAppForm } from "@/app/ui/components/Form";
import { PageTitle } from "@/app/ui/components/PageTitle";

import { AddShoppingItem } from "@/app/(private)/(shoppings)/_components/ShoppingItemForm";
import ShoppingListItem from "@/app/(private)/(shoppings)/_components/ShoppingListItem";
import { useSendShoppingMutation } from "@/app/(private)/(shoppings)/_hooks/useSendShoppingMutation";
import {
  createShoppingSchema,
  ShoppingFormValues,
} from "@/app/lib/schema/shoppingList.schema";
import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

type ShoppingFormProps = {
  initialData?: Shopping;
};

function ShoppingForm({ initialData }: ShoppingFormProps) {
  const isEdit = Boolean(initialData);

  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");
  const ti = useTranslations("Common.inputs");
  const ts = useTranslations("Shoppings");
  const tv = useTranslations("FormValidations");

  const defaultCurrency = useDefaultCurrency();

  const schema = createShoppingSchema(tv);

  const { mutateAsync } = useSendShoppingMutation(isEdit, initialData);

  const form = useAppForm({
    defaultValues: !!initialData ? initialData : getCreateDefaults(),

    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({ payload: value });
    },
  });

  return (
    <>
      <div className="mx-auto mt-6 max-w-4xl space-y-4">
        <PageTitle
          title={td(isEdit ? "editTitle" : "createTitle", {
            entity: te("shopping.nominative"),
          })}
          className="mb-6"
        />

        <form.AppForm>
          <form.AppField
            name={"title"}
            children={(field) => <field.TextField label={ti("listName")} />}
          />

          <form.Subscribe selector={(state) => state.values.items}>
            {(items = []) => {
              const totalCount = items.length;

              const totalAmount = items.reduce((sum, item) => {
                return sum + (Number(item.amount) || 0);
              }, 0);

              if (totalCount === 0) return null;

              return (
                <p className="mt-2 text-sm opacity-70">
                  {ts("itemsSummary", {
                    count: totalCount,
                    amount: getFormattedAmount(defaultCurrency, totalAmount),
                  })}
                </p>
              );
            }}
          </form.Subscribe>

          <AddShoppingItem form={form} />

          <form.Field name="items" mode="array">
            {(itemsField) => {
              return (
                <>
                  {!!itemsField.state.value.length && (
                    <ul className="space-y-2">
                      {itemsField.state.value.map(({ id }, index) => {
                        return (
                          <ShoppingListItem
                            key={id}
                            form={form}
                            index={index}
                          />
                        );
                      })}
                    </ul>
                  )}

                  <FieldError
                    errors={itemsField.state.meta.errors}
                    className="text-md mx-auto mt-2 font-bold"
                  />
                </>
              );
            }}
          </form.Field>

          <div className={"flex justify-end"}>
            <form.SubmitButton />
          </div>
        </form.AppForm>
      </div>
    </>
  );
}

export default withUserAndGroupContext(ShoppingForm);

function getCreateDefaults(): ShoppingFormValues {
  return {
    title: "",
    completed: false,
    items: [],
  };
}
