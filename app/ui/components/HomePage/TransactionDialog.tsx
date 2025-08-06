import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Category, Transaction } from "@/app/lib/definitions";

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

import {
  CurrencyOption,
  CurrencySelect,
} from "@/app/ui/components/CurrencySelect";
import { TextField } from "@/app/ui/components/TextField";
import { UserCategoriesSelect } from "@/app/ui/components/UserCategoriesSelect";

import { useSendTransactionMutation } from "./hooks/useSendTransactionMutation";

type DialogProps = {
  initial?: Transaction | null;
  open: boolean;
  onOpenChange: () => void;
};

export const TransactionDialog = ({
  initial,
  open,
  onOpenChange,
}: DialogProps) => {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const isEdit = !!initial;

  const { mutate, isPending, error } = useSendTransactionMutation(
    isEdit,
    () => {
      handleClose();
    }
  );

  const defaultCurrency = useDefaultCurrency();

  const initialState: Partial<Transaction> = {
    description: "",
    amount: 0,
    type: "outgoing",
    currency: defaultCurrency,
    category: "",
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
    onOpenChange();
  };

  const handleSubmit = () => {
    mutate({ payload: state });
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
      <DialogContent className="space-y-3">
        <DialogHeader>
          <DialogTitle>Transaction</DialogTitle>
          <DialogDescription>
            Make changes to your transaction
          </DialogDescription>
        </DialogHeader>

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
            label="Amount"
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
            label="Currency"
            className="w-[150px]"
          />
        </div>

        <TextField
          name="description"
          label="Description"
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
