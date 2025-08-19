"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import SelectField from "@/app/ui/components/common/SelectField";

import * as defaultCategories from "./options";

export type CategoryOption =
  | (typeof defaultCategories.incomingCategories)[number]
  | (typeof defaultCategories.outgoingCategories)[number];

interface DefaultCategorySelectProps {
  type: "incoming" | "outgoing";
  value: string;
  onChange: (option: string | CategoryOption | null) => void;
  className?: string;
}

export function DefaultCategorySelect({
  value,
  onChange,
  className,
  type,
}: DefaultCategorySelectProps) {
  const selectOptions = useMemo(() => {
    return type === "incoming"
      ? defaultCategories.incomingCategories
      : defaultCategories.outgoingCategories;
  }, [type]);

  const t = useTranslations("Common.selectors");

  const selectedOption = selectOptions.find((option) => option.value === value);

  return (
    <SelectField<CategoryOption>
      className={className}
      options={selectOptions}
      value={selectedOption || null}
      onChange={onChange}
      placeholder={t("defaultCategoryPlaceholder")}
      label={t("defaultCategoryLabel")}
      name="category"
      getOptionLabel={(option) => option.label}
      isSearchable={false}
    />
  );
}
