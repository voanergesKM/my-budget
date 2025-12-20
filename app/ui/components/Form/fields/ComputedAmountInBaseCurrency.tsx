import { useEffect } from "react";

import { useCurrencyRates } from "@/app/lib/hooks/useCurrencyRates";

type Props = {
  amount?: number | string;
  currency?: string;
  form: any;
};

export const ComputedAmountInBaseCurrency = ({
  amount,
  currency,
  form,
}: Props) => {
  const currencyRates = useCurrencyRates();

  useEffect(() => {
    if (!amount || !currency || !currencyRates?.rates?.[currency]) {
      return;
    }

    const next = Number(amount) / currencyRates.rates[currency];
    const current = form.getFieldValue("amountInBaseCurrency");

    if (current !== next) {
      form.setFieldValue("amountInBaseCurrency", next);
    }
  }, [amount, currency, currencyRates, form]);

  return null;
};
