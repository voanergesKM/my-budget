import { Field, FieldError, FieldLabel } from "@/app/ui/shadcn/Field";
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
}

export function SelectField<TValue, TOption>({
  label,
  placeholder = "Select...",
  options,
  getValue,
  displayValue = (opt) => (opt ? String(getValue(opt)) : ""),
  renderOption = (opt) => String(getValue(opt)),
}: SelectFieldProps<TValue, TOption>) {
  const field = useFieldContext<TValue>();
  const { errors, isValid } = field.state.meta;

  const selectedOption = options.find(
    (opt) => String(getValue(opt)) === String(field.state.value)
  );

  const handleValueChange = (value: string) => {
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
          {options.map((option, idx) => (
            <SelectItem key={idx} value={String(getValue(option))}>
              {renderOption(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FieldError errors={errors} />
    </Field>
  );
}
