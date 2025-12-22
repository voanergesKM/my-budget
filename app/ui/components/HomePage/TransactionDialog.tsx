"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";

import { Transaction } from "@/app/lib/definitions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/shadcn/Dialog";

import {
  amountFields,
  AmountWithCurrencyGroup,
} from "@/app/ui/components/Form/fieldGroups/AmountWithCurrencyGroup";

import { CreateEntityButton } from "../common/CreateEntityButton";

import { useTransactionForm } from "./hooks/useTransactionForm";

type DialogProps = {
  open: boolean;
  data: Transaction | boolean;
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
  const createTransaction = searchParams.get("createTransaction");

  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");

  const isEdit = data && typeof data === "object" && data !== null;

  const form = useTransactionForm(data, isEdit, open, handleOpenChange);

  function handleOpenChange(newOpen: boolean) {
    onOpenChange();
    if (!newOpen) {
      form.reset();
    }
  }

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
          <form.AmountInBaseCurrency />

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
            children={(field) => <field.CategoriesSelectField />}
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
