import React, { ChangeEvent } from "react";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { Field, FieldError, FieldLabel } from "@/app/ui/shadcn/Field";
import { Textarea } from "@/app/ui/shadcn/textarea";

import { useFieldContext } from "../..";

interface Props
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  label: string;
}

export const TextAreaField = ({ label, id, ...inputProps }: Props) => {
  const field = useFieldContext<string>();
  const isMobile = useIsMobile();

  const { errors, isValid } = field.state.meta;

  const inputId = id ?? label;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    field.handleChange(value);
  };

  return (
    <Field data-invalid={!isValid}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>

      <Textarea
        aria-invalid={!isValid}
        data-invalid={!isValid}
        id={inputId}
        value={field.state.value}
        onInput={handleChange}
        maxRows={isMobile ? 4 : 10}
      />

      <FieldError errors={errors} />
    </Field>
  );
};
