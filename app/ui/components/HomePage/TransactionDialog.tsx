"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";

import { useDefaultCurrency } from "@/app/lib/hooks/useDefaultCurrency";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/shadcn/Dialog";

import { useAppForm } from "@/app/ui/components/Form";
import {
  amountFields,
  AmountWithCurrencyGroup,
} from "@/app/ui/components/Form/fieldGroups/AmountWithCurrencyGroup";

import { createTransactionSchema } from "@/app/lib/schema/transaction.schema";

import { CreateEntityButton } from "../common/CreateEntityButton";
import { ComputedAmountInBaseCurrency } from "../Form/fields/ComputedAmountInBaseCurrency";

import { useSendTransactionMutation } from "./hooks/useSendTransactionMutation";

type DialogProps = {
  open: boolean;
  data: any;
  onOpenChange: () => void;
};

export const TransactionDialog = ({
  data,
  open,
  onOpenChange,
}: DialogProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const origin = searchParams.get("origin");
  const createTransaction = searchParams.get("createTransaction");

  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");

  const tv = useTranslations("FormValidations");

  const isEdit = data && typeof data === "object" && data !== null;

  const schema = createTransactionSchema(tv);

  const { mutateAsync } = useSendTransactionMutation(isEdit);

  const defaultCurrency = useDefaultCurrency();

  const formState = isEdit
    ? { ...data, category: data.category._id }
    : {
        type: (origin as "outgoing" | "incoming") ?? "outgoing",
        createdAt: new Date(),
        category: "",
        amount: 0,
        currency: defaultCurrency,
        description: "",
        amountInBaseCurrency: 0,
      };

  const form = useAppForm({
    defaultValues: formState,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const payload = isEdit ? value : [value];

      await mutateAsync({
        payload,
      });
      handleOpenChange(false);
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange();
    if (!newOpen) {
      form.reset();
    }
  };

  useEffect(() => {
    if (createTransaction === "true") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("createTransaction");

      const newQuery = params.toString();

      router.replace(newQuery ? `?${newQuery}` : pathName);
      onOpenChange();
    }
  }, [createTransaction, router, searchParams]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <CreateEntityButton
          label={tc("buttons.createTransaction")}
          Icon={PlusCircle}
        />
      </DialogTrigger>

      <DialogContent>
        <form.AppForm>
          <form.Subscribe
            selector={(state) => [state.values.amount, state.values.currency]}
          >
            {([amount, currency]) => (
              <ComputedAmountInBaseCurrency
                amount={amount}
                currency={currency}
                form={form}
              />
            )}
          </form.Subscribe>

          <DialogHeader>
            <DialogTitle>
              {td(isEdit ? "editTitle" : "createTitle", {
                entity: te("transaction.accusative"),
              })}
            </DialogTitle>
            <DialogDescription hidden>
              {td("description", { entity: te("transaction.accusative") })}
            </DialogDescription>
          </DialogHeader>

          <form.AppField
            name="createdAt"
            children={(field) => (
              <field.DateField label={tc("selectors.date")} />
            )}
          />

          <form.AppField
            name="category"
            children={(field) => (
              <field.CategoriesSelectField name="category" />
            )}
          />

          <AmountWithCurrencyGroup form={form} fields={amountFields} />

          <form.AppField
            name="description"
            children={(field) => (
              <field.TextAreaField label={tc("inputs.description")} />
            )}
          />

          <DialogFooter className="mt-6 gap-4">
            <form.CancelButton />
            <form.SubmitButton />
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
};
