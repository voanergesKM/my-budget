import React, { ChangeEvent, forwardRef, useState } from "react";

import { cn } from "@/app/lib/utils/utils";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/app/ui/shadcn/Field";
import { Input } from "@/app/ui/shadcn/Input";

import { useFieldContext } from "../..";

import { CalculatorPopover } from "./CalculatorPopover";

interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value"
> {
  label: string;
  description?: string;
  showCalculator?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      id,
      description,
      className,
      showCalculator = false,
      ...inputProps
    },
    ref
  ) => {
    const field = useFieldContext<string | number>();
    const [hasEnteredValue, setHasEnteredValue] = useState(false);

    const { errors, isValid } = field.state.meta;
    const inputId = id ?? label;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value, valueAsNumber } = event.target;
      setHasEnteredValue(true);

      if (inputProps.type === "number") {
        field.handleChange(
          Number.isNaN(valueAsNumber) ? (showCalculator ? "" : 0) : valueAsNumber
        );
      } else {
        field.handleChange(value);
      }

      inputProps.onChange?.(event);
    };

    return (
      <Field data-invalid={!isValid} className={cn(className)}>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        <div className="relative">
          <Input
            {...inputProps}
            ref={ref}
            aria-invalid={!isValid}
            data-invalid={!isValid}
            id={inputId}
            value={
              showCalculator && field.state.value === 0 && !hasEnteredValue
                ? ""
                : (field.state.value ?? "")
            }
            onChange={handleChange}
            autoComplete={"off"}
            className={cn(
              "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
              showCalculator && inputProps.type === "number" && "pr-10"
            )}
          />
          {showCalculator && inputProps.type === "number" && (
            <CalculatorPopover
              value={field.state.value}
              disabled={inputProps.disabled || inputProps.readOnly}
              onApply={(value) => {
                setHasEnteredValue(true);
                field.handleChange(value);
              }}
            />
          )}
        </div>

        {description && <FieldDescription>{description}</FieldDescription>}

        <FieldError errors={errors} />
      </Field>
    );
  }
);

TextField.displayName = "TextField";
