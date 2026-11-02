import React from "react";
import { useTranslations } from "next-intl";

import { SERVICE_CATEGORIES } from "@/app/lib/constants";

import { SelectField } from "./common/SelectField";

type Props = {
  label?: string;
  id?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
};

export const ServiceCategorySelectField = ({
  label,
  id,
  disabled,
  onChange,
}: Props) => {
  const tc = useTranslations("Common");

  const t = useTranslations("VehicleExpenseCategory");

  const selectLabel = label || tc("selectors.categoryLabel");

  return (
    <SelectField<String, string>
      getValue={(c) => c}
      label={selectLabel}
      id={id}
      disabled={disabled}
      options={SERVICE_CATEGORIES}
      displayValue={(c) => c && t(c)}
      renderOption={(c) => t(c)}
      onChange={onChange}
    />
  );
};
