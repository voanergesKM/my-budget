import { useEffect } from "react";

import { useCurrencyRates } from "@/app/lib/hooks/useCurrencyRates";

import { useFormContext } from "..";

export const AmountInBaseCurrency = () => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.values.amount, state.values.currency]}
    >
      {([amount, currency]) => {
        return (
          <ComputedAmountInBaseCurrency
            amount={amount}
            currency={currency}
            form={form}
          />
        );
      }}
    </form.Subscribe>
  );
};

type Props = {
  amount: number | string;
  currency: string;
  form: any;
  nameSpace?: string;
};

export const ComputedAmountInBaseCurrency = ({
  amount,
  currency,
  form,
  nameSpace = "amountInBaseCurrency",
}: Props) => {
  const currencyRates = useCurrencyRates();

  useEffect(() => {
    if (!amount || !currency || !currencyRates?.rates?.[currency]) {
      return;
    }

    const next = Number(amount) / currencyRates.rates[currency];
    const current = form.getFieldValue(nameSpace);

    if (current !== next) {
      form.setFieldValue(nameSpace, next);
    }
  }, [amount, currency, currencyRates, form]);

  return null;
};
