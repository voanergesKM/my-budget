import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormValidateOrFn } from "@tanstack/react-form";

import { useDefaultCurrency } from "@/app/lib/hooks/useDefaultCurrency";

import { useAppForm } from "@/app/ui/components/Form";

import { createTransactionSchema } from "@/app/lib/schema/transaction.schema";

import { useSendTransactionMutation } from "./useSendTransactionMutation";

export const useTransactionForm = (
  data: any,
  isEdit: boolean,
  open: boolean,
  handleOpenChange: (open: boolean) => void
) => {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const defaultCurrency = useDefaultCurrency();

  const { mutateAsync } = useSendTransactionMutation(isEdit);

  const tv = useTranslations("FormValidations");

  const schema = createTransactionSchema(tv);

  useEffect(() => {
    if (!open) return;

    const editData = {
      ...data,
      category: data.category?._id ?? "",
    };

    form.reset(
      isEdit && data
        ? editData
        : getCreateDefaults(origin as "outgoing" | "incoming", defaultCurrency)
    );
  }, [open, isEdit, data]);

  const form = useAppForm({
    defaultValues: getCreateDefaults(
      origin as "outgoing" | "incoming",
      defaultCurrency
    ),
    validators: {
      onSubmit: schema as FormValidateOrFn<{
        type: "outgoing" | "incoming";
        createdAt: string;
        category: string;
        amount: number;
        currency: string;
        description: string;
        amountInBaseCurrency: number;
      }>,
    },
    onSubmit: async ({ value }) => {
      const payload = isEdit ? value : [value];

      await mutateAsync({
        payload,
      });
      handleOpenChange(false);
    },
  });

  return form;
};

function getCreateDefaults(
  origin: "outgoing" | "incoming",
  defaultCurrency: string
) {
  return {
    type: (origin as "outgoing" | "incoming") ?? "outgoing",
    createdAt: new Date().toISOString(),
    category: "",
    amount: 0,
    currency: defaultCurrency,
    description: "",
    amountInBaseCurrency: 0,
  };
}
