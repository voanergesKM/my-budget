"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { LucideScanQrCode, PlusIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { RecipeScan, Transaction } from "@/app/lib/definitions";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";
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

import { sendRecipeScan } from "@/app/lib/actions/sendRecipeScan";

import { useSendTransactionMutation } from "../hooks/useSendTransactionMutation";

import {
  TransactionItemPlaceholder,
  TransactionItemRow,
} from "./TransactionItemRow";
import { prepareTransactionsForSave } from "./utils";

type State = {
  date: string;
  currency: string;
  transactions: Partial<Transaction>[];
};

function ScanRecipeDialog() {
  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");

  const currencyRates = useCurrencyRates();

  const defaultCurrency = useDefaultCurrency();

  const [openDialog, setOpenDialog] = useState(false);
  const [state, setState] = useState<State>({
    date: new Date().toISOString(),
    currency: defaultCurrency,
    transactions: [],
  });

  const { isPending: uploadingPhoto, mutate: sendPhoto } = useMutation({
    mutationFn: sendRecipeScan,
    onSuccess: onUploadedRecipe,
  });

  const { mutate: sendTransactions, isPending: sendingTransactions } =
    useSendTransactionMutation(false, () => {
      setOpenDialog(false);
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
    const transactions = prepareTransactionsForSave(
      result.date,
      result.items,
      currencyRates,
      result.currency
    );

    setState({
      date: result.date,
      currency: result.currency,
      transactions: transactions,
    });
  }

  const handleDeleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.transientId !== id),
    }));
  };

  const handleUpdateTransaction = (
    transientId: string,
    changes: Partial<Transaction>
  ) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.transientId === transientId ? { ...t, ...changes } : t
      ),
    }));
  };

  const handleAddTransaction = () => {
    setState((prev) => ({
      ...prev,
      transactions: [
        ...prev.transactions,
        {
          transientId: uuidv4(),
          description: "",
          amount: 0,
          type: "outgoing",
          createdAt: state.date,
          currency: state.currency,
          category: "",
        },
      ],
    }));
  };

  const handleSubmit = () => {
    sendTransactions({ payload: state.transactions });
  };

  const isSubmitDisabled = () => {
    return (
      state.transactions.length === 0 ||
      state.transactions.some((t) => !t.amount || !t.category)
    );
  };
  const dialogTitle = td("createTitle", {
    entity: te(
      state.transactions.length > 1
        ? "transaction.plural"
        : "transaction.accusative"
    ),
  });

  const totalAmount = getTotalAmount(state.transactions);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <TriggerButton handleUpload={handleUpload} />
      </DialogTrigger>

      <DialogContent className="space-y-3">
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
                {totalAmount.toFixed(2)} {state.currency}
              </span>
            </div>

            <div className="flex max-h-[60dvh] min-h-[30dvh] flex-col gap-4 overflow-y-auto">
              {state.transactions.map((item) => {
                return (
                  <TransactionItemRow
                    key={item.transientId}
                    item={item}
                    onDelete={handleDeleteTransaction}
                    onChange={handleUpdateTransaction}
                  />
                );
              })}
            </div>
          </>
        )}

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            size={"md"}
            isLoading={sendingTransactions}
            className="px-10"
            disabled={isSubmitDisabled()}
          >
            {tc("buttons.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ScanRecipeDialog;

function TriggerButton({
  handleUpload,
}: {
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const isMobile = useIsMobile();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tb = useTranslations("Common.buttons");
  const label = tb("recipeScan");

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        size={isMobile ? "icon" : "default"}
        className={"rounded-full p-2 md:rounded-md"}
        aria-label={label}
        onClick={triggerFileInput}
      >
        <LucideScanQrCode className="!size-6" />
        <span className="hidden md:inline">{label}</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </>
  );
}

function getTotalAmount(items: Partial<Transaction>[]) {
  return items.reduce((acc, item) => acc + (item.amount || 0), 0);
}
