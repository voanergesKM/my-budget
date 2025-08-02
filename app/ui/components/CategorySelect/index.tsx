"use client";

import { useMemo } from "react";

import SelectField from "@/app/ui/components/common/SelectField";

import * as defaultCategories from "./options";

export type CategoryOption =
  | (typeof defaultCategories.incomingCategories)[number]
  | (typeof defaultCategories.outgoingCategories)[number];

interface CategorySelectProps {
  type: "incoming" | "outgoing";
  value: string;
  onChange: (option: string | CategoryOption | null) => void;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  className,
  type,
}: CategorySelectProps) {
  const selectOptions = useMemo(() => {
    return type === "incoming"
      ? defaultCategories.incomingCategories
      : defaultCategories.outgoingCategories;
  }, [type]);

  const selectedOption = selectOptions.find((option) => option.value === value);

  return (
    <SelectField<CategoryOption>
      className={className}
      options={selectOptions}
      value={selectedOption || null}
      onChange={onChange}
      placeholder={"Select category..."}
      label={"Category"}
      name="category"
      isSearchable={false}
    />
  );
}
