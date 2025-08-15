"use client";

import React from "react";
import { useTranslations } from "next-intl";

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
  label?: string;
}

export function CurrencySelect({
  value,
  onChange,
  className,
  label,
}: CurrencySelectProps) {
  const t = useTranslations("Common.selectors");

  const selectedCurrencyOption = currencyOptions.find(
    (option) => option.value === value
  );

  return (
    <SelectField<CurrencyOption>
      className={className}
      options={currencyOptions}
      value={selectedCurrencyOption || null}
      onChange={onChange}
      label={label ?? t("currencyLabel")}
      placeholder={t("currencyPlaceholder")}
      name="defaultCurrency"
      getOptionLabel={(option) => option.label}
    />
  );
}
