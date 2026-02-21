import React from "react";
import { useTranslations } from "next-intl";

import { SERVICE_CATEGORIES } from "@/app/lib/constants";

import { SelectField } from "./common/SelectField";

type Props = {
  label?: string;
};

export const ServiceCategorySelectField = ({ label }: Props) => {
  const tc = useTranslations("Common");

  const t = useTranslations("VehicleExpenseCategory");

  const selectLabel = label || tc("selectors.currency");

  return (
    <SelectField<String, string>
      getValue={(c) => c}
      label={selectLabel}
      options={SERVICE_CATEGORIES}
      displayValue={(c) => c && t(c)}
      renderOption={(c) => t(c)}
    />
  );
};
