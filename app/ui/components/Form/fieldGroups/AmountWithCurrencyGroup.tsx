import { createFieldMap } from "@tanstack/react-form";

import { withFieldGroup } from "..";

const defaultValues = {
  amount: "",
  currency: "",
};

export const amountFields = createFieldMap(defaultValues);

export const AmountWithCurrencyGroup = withFieldGroup({
  render: function Render({ group }) {
    return (
      <div className="flex gap-4">
        <group.AppField name={"amount"}>
          {(field) => <field.AmountField />}
        </group.AppField>

        <group.AppField name={"currency"}>
          {(field) => <field.CurrencySeletcField />}
        </group.AppField>
      </div>
    );
  },
});
