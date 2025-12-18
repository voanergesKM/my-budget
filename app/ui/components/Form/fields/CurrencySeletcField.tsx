import React from "react";
import { useTranslations } from "next-intl";

import { SelectField } from "./common/SelectField";

export const currencyOptions = [
  { label: "₴ UAH", value: "UAH" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
];

type Props = {
  label?: string;
};

export const CurrencySeletcField = ({ label }: Props) => {
  const tc = useTranslations("Common");

  const selectLabel = label || tc("selectors.currency");

  return (
    <SelectField<String, (typeof currencyOptions)[number]>
      getValue={(c) => c.value}
      label={selectLabel}
      options={currencyOptions}
      displayValue={(c) => c?.label}
      renderOption={(c) => c.label}
    />
  );
};
