"use client";

import React from "react";

import SelectField from "@/app/ui/components/common/SelectField";

export type Currency = "UAH" | "USD" | "EUR";

export const currencyOptions = [
  { label: "₴ UAH", value: "UAH" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
];

export type CurrencyOption = {
  label: string;
  value: string;
};

export interface CurrencySelectProps {
  value: string;
  onChange: (option: string | CurrencyOption | null) => void;
  className?: string;
}

export function CurrencySelect({
  value,
  onChange,
  className,
}: CurrencySelectProps) {
  const selectedCurrencyOption = currencyOptions.find(
    (option) => option.value === value
  );

  return (
    <SelectField<CurrencyOption>
      className={className}
      options={currencyOptions}
      value={selectedCurrencyOption || null}
      onChange={onChange}
      placeholder={"Select currency..."}
      label={"Default Currency"}
      name="defaultCurrency"
    />
  );
}
