import React, { ChangeEvent, forwardRef } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/app/ui/shadcn/Field";
import { Input } from "@/app/ui/shadcn/Input";

import { useFieldContext } from "../..";

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  label: string;
  description?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, description, ...inputProps }, ref) => {
    const field = useFieldContext<string | number>();

    const { errors, isValid } = field.state.meta;
    const inputId = id ?? label;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value, valueAsNumber } = event.target;
      field.handleChange(inputProps.type === "number" ? valueAsNumber : value);
      inputProps.onChange?.(event);
    };

    return (
      <Field data-invalid={!isValid}>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        <Input
          ref={ref}
          aria-invalid={!isValid}
          data-invalid={!isValid}
          id={inputId}
          value={field.state.value}
          onChange={handleChange}
          autoComplete={"off"}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          {...inputProps}
        />

        {description && <FieldDescription>{description}</FieldDescription>}

        <FieldError errors={errors} />
      </Field>
    );
  }
);

TextField.displayName = "TextField";
