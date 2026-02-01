import React from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/app/ui/shadcn/Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/app/ui/shadcn/Select";

import { useFieldContext } from "../..";

interface SelectFieldProps<TValue, TOption> {
  label: string;
  placeholder?: string;
  options: TOption[];

  displayValue?: (option: TOption | undefined) => React.ReactNode;

  getValue: (option: TOption) => TValue;

  renderOption?: (option: TOption) => React.ReactNode;
  description?: string;
  showEmpty?: boolean;
  emptyLabel?: string;
  onChange?: () => void;
}

const EMPTY_VALUE = "__empty__";

export function SelectField<TValue, TOption>({
  label,
  placeholder = "Select...",
  options,
  getValue,
  displayValue = (opt) => (opt ? String(getValue(opt)) : ""),
  renderOption = (opt) => String(getValue(opt)),
  description,
  showEmpty,
  emptyLabel,
  onChange,
}: SelectFieldProps<TValue, TOption>) {
  const field = useFieldContext<TValue>();
  const { errors, isValid } = field.state.meta;

  const selectedOption = options.find(
    (opt) => String(getValue(opt)) === String(field.state.value)
  );

  const handleValueChange = (value: string) => {
    if (onChange) {
      onChange();
    }

    if (value === EMPTY_VALUE) {
      field.handleChange("" as TValue);

      return;
    }

    const opt = options.find((o) => String(getValue(o)) === value);
    if (opt) field.handleChange(getValue(opt));
  };

  return (
    <Field data-invalid={!isValid}>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>

      <Select
        value={String(field.state.value ?? "")}
        onValueChange={handleValueChange}
      >
        <SelectTrigger id={label} data-invalid={!isValid}>
          <div className="flex items-center gap-2">
            {displayValue(selectedOption) ?? (
              <span className="opacity-50">{placeholder}</span>
            )}
          </div>
        </SelectTrigger>

        <SelectContent position="popper">
          {showEmpty && (
            <SelectItem value={EMPTY_VALUE}>
              {emptyLabel ?? "— None —"}
            </SelectItem>
          )}
          {options.map((option, idx) => (
            <SelectItem key={idx} value={String(getValue(option))}>
              {renderOption(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldError errors={errors} />
    </Field>
  );
}
