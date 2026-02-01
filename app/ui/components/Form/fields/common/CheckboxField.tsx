import React from "react";

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
}: {
  label?: string;
  fieldDescription?: string;
  id?: string;
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
      className={"items-baseline"}
    >
      <Checkbox
        id={inputId}
        checked={value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
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
