import React from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/app/ui/shadcn/Field";
import { Switch } from "@/app/ui/shadcn/switch";

import { useFieldContext } from "../..";

interface SwitchFieldProps {
  label: string;
  fieldDescription?: string;
}

export const SwitchField = ({
  label = "placeholder",
  fieldDescription,
}: SwitchFieldProps) => {
  const field = useFieldContext<boolean>();

  const { errors, isValid } = field.state.meta;
  const value = field.state.value ?? false;

  return (
    <Field
      data-invalid={!isValid}
      orientation={"horizontal"}
      className="w-full"
    >
      <FieldContent>
        <FieldLabel htmlFor={label}>{label}</FieldLabel>

        {fieldDescription && (
          <FieldDescription>{fieldDescription}</FieldDescription>
        )}
      </FieldContent>
      <Switch
        id={label}
        checked={value}
        onCheckedChange={(checked) => {
          field.handleChange(checked);
        }}
      />

      <FieldError errors={errors} />
    </Field>
  );
};
