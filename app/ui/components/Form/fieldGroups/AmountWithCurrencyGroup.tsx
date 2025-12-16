import { useTranslations } from "next-intl";
import { createFieldMap } from "@tanstack/react-form";

import { withFieldGroup } from "..";

export const currencyOptions = [
  { label: "₴ UAH", value: "UAH" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
];

const defaultValues = {
  amount: "",
  currency: "",
};

export const amountFields = createFieldMap(defaultValues);

export const AmountWithCurrencyGroup = withFieldGroup({
  render: function Render({ group }) {
    const tc = useTranslations("Common");

    return (
      <div className="flex gap-4">
        <group.AppField name="amount">
          {(field) => (
            <field.TextField
              label={tc("inputs.amount")}
              type="number"
              inputMode="decimal"
            />
          )}
        </group.AppField>

        <group.AppField name="currency">
          {(field) => (
            <field.SelectField<String, (typeof currencyOptions)[number]>
              getValue={(c) => c.value}
              label={tc("selectors.currency")}
              options={currencyOptions}
              displayValue={(c) => c?.label}
              renderOption={(c) => c.label}
            />
          )}
        </group.AppField>
      </div>
    );
  },
});
