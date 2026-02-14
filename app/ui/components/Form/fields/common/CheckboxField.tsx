import React from "react";

import { cn } from "@/app/lib/utils/utils";

import { Checkbox } from "@/app/ui/shadcn/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/app/ui/shadcn/Field";

import { useFieldContext } from "../..";

export const CheckboxField = ({
  label,
  fieldDescription,
  id,
  onChange,
  className,
  disabled,
}: {
  label?: string;
  fieldDescription?: string;
  id?: string;
  onChange?: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
}) => {
  const field = useFieldContext<boolean>();

  const { errors, isValid } = field.state.meta;
  const { value } = field.state;

  const inputId = id ?? field.name;

  return (
    <Field
      data-invalid={!isValid}
      aria-invalid={!isValid}
      orientation="horizontal"
      className={cn("items-baseline", className)}
    >
      <Checkbox
        disabled={disabled}
        id={inputId}
        checked={value}
        onCheckedChange={(checked) => {
          field.handleChange(checked === true);
          onChange?.(checked === true);
        }}
        className={"grow-0"}
      />

      <FieldContent>
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        {fieldDescription && (
          <FieldDescription>{fieldDescription}</FieldDescription>
        )}
      </FieldContent>

      <FieldError errors={errors} />
    </Field>
  );
};
