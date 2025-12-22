"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import z from "zod";

import { RecipeScan, Transaction } from "@/app/lib/definitions";
import { mergeDateAndTime } from "@/app/lib/utils/dateUtils";

import { useCurrencyRates } from "@/app/lib/hooks/useCurrencyRates";
import { useDefaultCurrency } from "@/app/lib/hooks/useDefaultCurrency";

import { Button } from "@/app/ui/shadcn/Button";
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
import { ComputedAmountInBaseCurrency } from "@/app/ui/components/Form/fields/AmountInBaseCurrency";

import { sendRecipeScan } from "@/app/lib/actions/sendRecipeScan";
import { createSimpleTransactionSchema } from "@/app/lib/schema/transaction.schema";

import { useSendTransactionMutation } from "../hooks/useSendTransactionMutation";

import TransactionItemRow, {
  TransactionItemPlaceholder,
} from "./TransactionItemRow";
import { TriggerButton } from "./TriggerButton";
import { prepareTransactionsForSave } from "./utils";

function ScanRecipeDialog() {
  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");
  const tv = useTranslations("FormValidations");

  const { mutateAsync } = useSendTransactionMutation(false);

  const defaultCurrency = useDefaultCurrency();

  const schema = createValidationSchema(tv);

  const form = useAppForm({
    defaultValues: {
      createdAt: new Date(),
      type: "outgoing",
      currency: defaultCurrency,
      totalAmount: 0,
      transactions: [createEmptyTransaction()],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    validators: {
      onSubmit: schema,
    },

    onSubmit: async ({ value }) => {
      const createdAt = mergeDateAndTime(
        value.createdAt,
        value.time
      ).toISOString();

      const payload = value.transactions.map((t) => ({
        ...t,
        type: value.type as "incoming" | "outgoing",
        createdAt,
        currency: value.currency,
      }));

      await mutateAsync({
        payload,
      });

      setOpenDialog(false);
      form.reset();
    },
  });

  const currencyRates = useCurrencyRates();

  const [openDialog, setOpenDialog] = useState(false);

  const { isPending: uploadingPhoto, mutate: sendPhoto } = useMutation({
    mutationFn: sendRecipeScan,
    onSuccess: onUploadedRecipe,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOpenDialog(true);

    const formData = new FormData();
    formData.append("file", file);

    sendPhoto(formData);
  };

  function onUploadedRecipe(result: RecipeScan) {
    const prepared = prepareTransactionsForSave(
      result.items,
      currencyRates,
      result.currency
    );

    form.setFieldValue("currency", result.currency);

    if (result.date) {
      form.setFieldValue("createdAt", new Date(result.date));
      form.setFieldValue(
        "time",
        new Date(result.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    form.setFieldValue(
      "totalAmount",
      Number(getTotalAmount(prepared).toFixed(2))
    );
    form.setFieldValue("transactions", prepared);
  }

  const handleAddTransaction = () => {
    const newTransactions = [
      createEmptyTransaction(),
      ...form.state.values.transactions,
    ];
    form.setFieldValue("transactions", newTransactions);
  };

  const onDeleteTransaction = (index: number) => {
    form.removeFieldValue("transactions", index);
  };

  const totalAmount = useStore(form.store, (state) => state.values.totalAmount);
  const currency = useStore(form.store, (state) => state.values.currency);
  const totalTransactions = useStore(
    form.store,
    (state) => state.values.transactions.length
  );

  const dialogTitle = td("createTitle", {
    entity: te(
      totalTransactions > 1 ? "transaction.plural" : "transaction.accusative"
    ),
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <TriggerButton handleUpload={handleUpload} />
      </DialogTrigger>

      <DialogContent className="space-y-3">
        <form.AppForm>
          <form.Subscribe
            selector={(state) => state.values.transactions.map((t) => t.amount)}
          >
            {(amounts) => <ComputedTotalAmount amounts={amounts} form={form} />}
          </form.Subscribe>

          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription hidden>
              {td("description", { entity: te("transaction.accusative") })}
            </DialogDescription>
          </DialogHeader>

          {uploadingPhoto ? (
            <TransactionItemPlaceholder />
          ) : (
            <>
              <div className="flex w-full flex-col items-end md:flex-row md:gap-6">
                <div className="flex w-full flex-row items-end gap-2">
                  <form.AppField
                    name="createdAt"
                    children={(field) => (
                      <field.DateField label={tc("selectors.date")} />
                    )}
                  />

                  <div>
                    <form.AppField
                      name="time"
                      children={(field) => (
                        <field.TextField type="time" label="Time" />
                      )}
                    />
                  </div>
                </div>

                <div className="w-full md:w-[50%]">
                  <form.AppField name={"currency"}>
                    {(field) => <field.CurrencySeletcField />}
                  </form.AppField>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  size={"icon"}
                  className="h-8 w-8 flex-shrink-0 rounded-full p-1"
                  aria-label="Add transaction"
                  onClick={handleAddTransaction}
                >
                  <PlusIcon />
                </Button>

                <span className="text-sm text-muted-foreground">
                  {totalAmount} {currency}
                </span>
              </div>

              <div className="flex max-h-[35dvh] min-h-[30dvh] flex-col gap-4 overflow-y-auto">
                <form.Field name="transactions" mode="array">
                  {(transactionsField) => (
                    <div className="space-y-4">
                      {transactionsField.state.value.map((_, i) => (
                        <div key={i}>
                          <form.Subscribe
                            selector={(state) => [
                              state.values.transactions[i].amount,
                              state.values.currency,
                            ]}
                          >
                            {([amount, currency]) => {
                              return (
                                <ComputedAmountInBaseCurrency
                                  amount={amount}
                                  currency={String(currency)}
                                  form={form}
                                  nameSpace={`transactions[${i}].amountInBaseCurrency`}
                                />
                              );
                            }}
                          </form.Subscribe>

                          <TransactionItemRow
                            key={i}
                            onDelete={onDeleteTransaction}
                            form={form}
                            index={i}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </form.Field>
              </div>
            </>
          )}

          <DialogFooter className="mt-6 gap-3">
            <form.CancelButton />
            <form.SubmitButton
              disabled={uploadingPhoto || !totalTransactions}
            />
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

export default ScanRecipeDialog;

function getTotalAmount(items: Partial<Transaction>[]) {
  return items.reduce((acc, item) => acc + (item.amount || 0), 0);
}

const ComputedTotalAmount = ({
  amounts,
  form,
}: {
  amounts: (number | undefined)[];
  form: any;
}) => {
  useEffect(() => {
    const nextTotal = amounts.reduce(
      (acc: number, a) => acc + (Number(a) || 0),
      0
    );

    const current = form.getFieldValue("totalAmount");

    if (current !== nextTotal) {
      form.setFieldValue("totalAmount", Number(nextTotal.toFixed(2)));
    }
  }, [amounts, form]);

  return null;
};

function createEmptyTransaction() {
  return { category: "", amount: 0, description: "", amountInBaseCurrency: 0 };
}

function createValidationSchema(t: (key: string, values?: any) => string) {
  return z.object({
    createdAt: z.date(),
    time: z.string(),
    type: z.enum(["incoming", "outgoing"]),
    currency: z.string(),
    totalAmount: z.number(),

    transactions: z.array(createSimpleTransactionSchema(t)),
  });
}
