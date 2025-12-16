import React from "react";
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

import { CreateEntityButton } from "@/app/ui/components/common/CreateEntityButton";
import { useAppForm } from "@/app/ui/components/Form";
import {
  amountFields,
  AmountWithCurrencyGroup,
} from "@/app/ui/components/Form/fieldGroups/AmountWithCurrencyGroup";

import { createScheduledPaymentSchema } from "@/app/lib/schema/scheduledPaymentsSchema";
import { ScheduledPaymentType } from "@/app/lib/types";

import { useSendScheduledPaymentMutation } from "../hooks/useSendScheduledPaymentMutation";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

type DialogProps = {
  open: boolean;
  data: any;
  onOpenChange: () => void;
};

export default function SchedulePaymentDialog({
  open,
  data,
  onOpenChange,
}: DialogProps) {
  const tc = useTranslations("Common");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");
  const tv = useTranslations("FormValidations");
  const tf = useTranslations("Frequency");

  const isEdit = data && typeof data === "object" && data !== null;

  const defaultCurrency = useDefaultCurrency();

  const schema = createScheduledPaymentSchema(tv);

  const { mutateAsync } = useSendScheduledPaymentMutation(isEdit);

  const formState = isEdit
    ? data
    : {
        description: "",
        amount: 0,
        currency: defaultCurrency,
        category: "",
        proceedDate: tomorrow,
        skipNext: false,
        frequency: "monthly",
        status: "active",
      };

  const form = useAppForm({
    defaultValues: formState,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        payload: value as ScheduledPaymentType,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <CreateEntityButton
          label={tc("buttons.createScheduledPayment")}
          Icon={PlusCircle}
        />
      </DialogTrigger>

      <DialogContent className="gap-2 md:gap-3">
        <form.AppForm>
          <DialogHeader>
            <DialogTitle>
              {td(isEdit ? "editTitle" : "createTitle", {
                entity: te("scheduledPayment.nominative"),
              })}
            </DialogTitle>
            <DialogDescription hidden>
              {td("description", { entity: te("transaction.accusative") })}
            </DialogDescription>
          </DialogHeader>

          <div className="mr-[-8px] max-h-[65dvh] overflow-auto pr-2">
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField label={tc("inputs.description")} />
              )}
            />
            <AmountWithCurrencyGroup form={form} fields={amountFields} />

            <form.AppField
              name="category"
              children={(field) => (
                <field.CategoriesSelectField name="category" />
              )}
            />

            <div className="flex flex-col items-end gap-2 md:flex-row md:gap-4">
              <form.AppField
                name="proceedDate"
                children={(field) => (
                  <field.DateField
                    label={tc("selectors.proceedDate")}
                    minDate={tomorrow}
                  />
                )}
              />

              <form.AppField
                name="frequency"
                children={(field) => (
                  <field.SelectField<String, { value: string; label: string }>
                    label={tc("selectors.scheduledPaymentFrequency")}
                    options={getFrequencyOptions(tf)}
                    getValue={(o) => o.value}
                    displayValue={(o) => o?.label}
                    renderOption={(o) => o.label}
                  />
                )}
              />
            </div>

            {isEdit && (
              <form.AppField
                name="skipNext"
                listeners={{
                  onChange: ({ value }) => {
                    form.setFieldValue("status", value ? "paused" : "active");
                  },
                  onMount: () => {
                    const status = form.getFieldValue("status");
                    form.setFieldValue("skipNext", status === "paused");
                  },
                }}
                children={(field) => (
                  <field.SwitchField
                    label={tc("switch.skipNextPayment")}
                    fieldDescription={tc("switch.skipNextPaymentDescription")}
                  />
                )}
              />
            )}
          </div>
          <DialogFooter>
            <form.SubmitButton label={tc("buttons.save")} />
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

function getFrequencyOptions(tf: (key: string) => string) {
  return [
    { value: "daily", label: tf("daily") },
    { value: "weekly", label: tf("weekly") },
    { value: "2weeks", label: tf("2weeks") },
    { value: "4weeks", label: tf("4weeks") },
    { value: "monthly", label: tf("monthly") },
    { value: "annually", label: tf("annually") },
  ];
}
