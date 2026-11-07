"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { ShoppingItem } from "@/app/lib/definitions";
import { mergeDateAndTime } from "@/app/lib/utils/dateUtils";
import Notify from "@/app/lib/utils/notify";

import { sendRecipeScan } from "@/app/lib/api";
import { ReceiptScanError } from "@/app/lib/api/sendRecipeScan";

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

import { useSendTransactionMutation } from "../hooks/useSendTransactionMutation";

import TransactionItemRow, {
  TransactionItemPlaceholder,
} from "./TransactionItemRow";
import { TransactionMetaData } from "./TransactionMetaData";
import {
  createValidationSchema,
  getTotalAmount,
  prepareScannedTransactionsForSave,
  prepareTransactionsFromShoppingItems,
} from "./utils";

type TransactionSource =
  | { type: "scan"; file: File; onClose: () => void }
  | {
      type: "shopping";
      items: ShoppingItem[];
      invalidateQueryKeys?: (string | number)[][];
    };

function TransactionBuilderDialog({
  source,
  disabled,
}: {
  source: TransactionSource;
  disabled?: boolean;
}) {
  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");
  const tv = useTranslations("FormValidations");
  const tu = useTranslations("Units");
  const ts = useTranslations("ReceiptScan");

  const { mutateAsync } = useSendTransactionMutation(
    false,
    source.type === "shopping" ? source.invalidateQueryKeys : undefined
  );

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
      if (source.type === "scan") source.onClose();
    },
  });

  const currencyRates = useCurrencyRates();

  const [openDialog, setOpenDialog] = useState(source.type === "scan");
  const startedFile = useRef<File | null>(null);

  const {
    isPending,
    isSuccess,
    isError,
    mutate: sendPhoto,
  } = useMutation({
    mutationFn: sendRecipeScan,
    onSuccess: onUploadedRecipe,
    onError: (error) => {
      console.error("Receipt scan failed:", error);
      Notify.error(
        ts(
          error instanceof ReceiptScanError && error.code === "FILE_TOO_LARGE"
            ? "fileTooLarge"
            : "failed"
        )
      );
    },
  });

  const handleOpenDialog = () => {
    if (source.type === "shopping" && source.items.length) {
      const prepared = prepareTransactionsFromShoppingItems(
        source.items,
        currencyRates,
        defaultCurrency,
        tu
      );

      form.setFieldValue("transactions", prepared);
    }

    setOpenDialog(true);
  };

  useEffect(() => {
    if (source.type !== "scan" || startedFile.current === source.file) return;
    startedFile.current = source.file;
    sendPhoto(source.file);
  }, [source, sendPhoto]);

  const uploadingPhoto =
    isPending || (source.type === "scan" && !isSuccess && !isError);

  function onUploadedRecipe(
    result: Awaited<ReturnType<typeof sendRecipeScan>>
  ) {
    const prepared = prepareScannedTransactionsForSave(
      result.items,
      currencyRates,
      result.currency
    );

    form.setFieldValue("currency", result.currency);

    if (result.date && !Number.isNaN(new Date(result.date).getTime())) {
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
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open && source.type === "scan") source.onClose();
      }}
    >
      {source.type === "shopping" && (
        <DialogTrigger asChild>
          <Button onClick={handleOpenDialog} disabled={disabled} size={"md"}>
            {tc("buttons.createTransaction")}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="space-y-0" variant={"full"}>
        <form.AppForm>
          <form.Subscribe
            selector={(state) => state.values.transactions.map((t) => t.amount)}
          >
            {(amounts) => <ComputedTotalAmount amounts={amounts} form={form} />}
          </form.Subscribe>

          <DialogHeader className="mb-0">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription hidden>
              {td("description", { entity: te("transaction.accusative") })}
            </DialogDescription>
          </DialogHeader>

          {uploadingPhoto ? (
            <TransactionItemPlaceholder />
          ) : (
            <div className="flex min-h-0 flex-col space-y-4">
              <TransactionMetaData form={form} />

              <div className="flex justify-between">
                <Button
                  size={"icon"}
                  className="h-8 w-8 flex-shrink-0 rounded-full p-1"
                  aria-label="Add transaction"
                  onClick={handleAddTransaction}
                >
                  <PlusIcon />
                </Button>
              </div>

              <div className="mr-[-8px] flex flex-col gap-4 overflow-y-auto pr-2">
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
            </div>
          )}

          <DialogFooter className="gap-3">
            <form.Subscribe selector={(state) => state.values.currency}>
              {(currency) => {
                const ratesUnavailable =
                  source.type === "scan" &&
                  isSuccess &&
                  !currencyRates?.rates?.[currency];
                return (
                  <>
                    {ratesUnavailable && (
                      <p className="text-sm text-destructive">
                        {ts("ratesUnavailable")}
                      </p>
                    )}
                    <form.SubmitButton
                      disabled={
                        uploadingPhoto || !totalTransactions || ratesUnavailable
                      }
                    />
                  </>
                );
              }}
            </form.Subscribe>
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionBuilderDialog;

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
