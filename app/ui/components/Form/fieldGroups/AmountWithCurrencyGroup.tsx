import { useTranslations } from "next-intl";
import { createFieldMap } from "@tanstack/react-form";

import { withFieldGroup } from "..";

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
          {(field) => <field.CurrencySeletcField />}
        </group.AppField>
      </div>
    );
  },
});
