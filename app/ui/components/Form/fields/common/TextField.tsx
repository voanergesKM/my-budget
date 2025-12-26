import React, { ChangeEvent } from "react";

import { Field, FieldError, FieldLabel } from "@/app/ui/shadcn/Field";
import { Input } from "@/app/ui/shadcn/Input";

import { useFieldContext } from "../..";

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  label: string;
}

export const TextField = ({ label, id, ...inputProps }: TextFieldProps) => {
  const field = useFieldContext<string | number>();

  const { errors, isValid } = field.state.meta;
  const inputId = id ?? label;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    field.handleChange(value);
    if (inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  return (
    <Field data-invalid={!isValid}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Input
        aria-invalid={!isValid}
        data-invalid={!isValid}
        id={inputId}
        value={field.state.value}
        onChange={handleChange}
        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        {...inputProps}
      />
      <FieldError errors={errors} />
    </Field>
  );
};
