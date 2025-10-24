"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";

import { Category, Transaction } from "@/app/lib/definitions";

import { useCurrencyRates } from "@/app/lib/hooks/useCurrencyRates";
import { useDefaultCurrency } from "@/app/lib/hooks/useDefaultCurrency";
import { FieldError, useFormErrors } from "@/app/lib/hooks/useFormErrors";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";

import DatePicker from "@/app/ui/components/common/DatePicker";
import {
  CurrencyOption,
  CurrencySelect,
} from "@/app/ui/components/CurrencySelect";
import { TextField } from "@/app/ui/components/TextField";
import { UserCategoriesSelect } from "@/app/ui/components/UserCategoriesSelect";

import { CreateEntityButton } from "../common/CreateEntityButton";

import { useSendTransactionMutation } from "./hooks/useSendTransactionMutation";

type DialogProps = {
  initial?: Transaction | null;
  open: boolean;
  onCloseDialog: () => void;
  setOpenDialog: (open: boolean) => void;
};

export const TransactionDialog = ({
  initial,
  open,
  onCloseDialog,
  setOpenDialog,
}: DialogProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const createTransaction = searchParams.get("createTransaction");

  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");

  const isEdit = !!initial;

  const { mutate, isPending, error } = useSendTransactionMutation(
    isEdit,
    () => {
      handleClose();
    }
  );

  const defaultCurrency = useDefaultCurrency();

  const currencyRates = useCurrencyRates();

  const initialState: Partial<Transaction> = {
    description: "",
    amount: 0,
    type: (origin as "outgoing" | "incoming") ?? "outgoing",
    currency: defaultCurrency,
    category: "",
    createdAt: new Date().toISOString(),
  };

  const [state, setState] = useState<Partial<Transaction>>(
    initial ?? initialState
  );

  const { clearFieldError, getFieldError, setFormErrors } = useFormErrors();

  useEffect(() => {
    if (origin && (origin === "outgoing" || origin === "incoming")) {
      setState((prev) => ({
        ...prev,
        type: origin as "outgoing" | "incoming",
      }));
    }
  }, [origin, open]);

  useEffect(() => {
    if (createTransaction === "true") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("createTransaction");

      const newQuery = params.toString();

      router.replace(newQuery ? `?${newQuery}` : window.location.pathname);
      setOpenDialog(true);
    }
  }, [createTransaction, router, searchParams]);

  useEffect(() => {
    if (initial) return;
    setState((prev) => ({
      ...prev,
      currency: defaultCurrency,
    }));
  }, [initial, defaultCurrency]);

  useEffect(() => {
    if (initial && !!Object.values(initial).length) {
      setState(initial);
    } else {
      setState(initialState);
    }
  }, [initial]);

  useEffect(() => {
    if (error && typeof error === "object" && "errors" in error) {
      setFormErrors(error.errors as FieldError[]);
    } else {
      setFormErrors([]);
    }
  }, [error]);

  const handleClose = () => {
    setState(initialState);
    setFormErrors([]);
    onCloseDialog();
  };

  const handleSubmit = () => {
    const amountInBaseCurrency =
      state.amount! / currencyRates.rates[state.currency as string];

    const payload = {
      ...state,
      amountInBaseCurrency: Number(amountInBaseCurrency.toFixed(2)),
    };

    mutate({
      payload: isEdit ? payload : [payload],
    });
  };

  const handleCurrencyChange = (option: string | CurrencyOption | null) => {
    if (!option) return;
    if (typeof option === "string") {
    } else if (option) {
      setState((prev) => ({ ...prev, currency: option.value }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <CreateEntityButton
        label={tc("buttons.createTransaction")}
        Icon={PlusCircle}
        onClick={() => setOpenDialog(true)}
      />

      <DialogContent className="space-y-3">
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

        <DatePicker
          mode={"single"}
          label={tc("selectors.date")}
          currentValue={state.createdAt ? new Date(state.createdAt) : undefined}
          onChange={(date) => {
            if (!date) return;
            setState((prev) => ({
              ...prev,
              createdAt: (date as Date).toISOString(),
            }));
          }}
        />

        <UserCategoriesSelect
          value={
            typeof state?.category === "object"
              ? state.category._id
              : state?.category || ""
          }
          onChange={(category: Category | null | string) => {
            if (!category) return;
            if (typeof category === "string") {
              setState((prev) => ({ ...prev, category: category }));
            } else if (category) {
              setState((prev) => ({ ...prev, category: category._id }));
            }
            clearFieldError("category");
          }}
          {...getFieldError("category")}
        />

        <div className="flex items-center gap-4">
          <TextField
            required
            type="number"
            name="amount"
            label={tc("inputs.amount")}
            value={state.amount || ""}
            onChange={(e) => {
              setState((prev) => ({ ...prev, amount: +e.target.value }));
              clearFieldError("amount");
            }}
            {...getFieldError("amount")}
          />
          <CurrencySelect
            value={state?.currency || defaultCurrency}
            onChange={handleCurrencyChange}
            label={tc("selectors.currency")}
            className="w-[150px]"
          />
        </div>

        <TextField
          name="description"
          label={tc("inputs.description")}
          value={state.description || ""}
          onChange={(e) => {
            setState((prev) => ({ ...prev, description: e.target.value }));
          }}
        />

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            size={"md"}
            isLoading={isPending}
            className="px-10"
          >
            {tc("buttons.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
