import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

import { Field, FieldError } from "@/app/ui/shadcn/Field";

import DatePicker from "@/app/ui/components/common/DatePicker";

import { useFieldContext } from "../..";

interface DateFieldProps {
  label: string;
  minDate?: Date;
}

export const DateField = ({ label, minDate }: DateFieldProps) => {
  const field = useFieldContext<string | number>();

  const tc = useTranslations("Common");

  const { errors, isValid } = field.state.meta;

  return (
    <Field data-invalid={!isValid}>
      <DatePicker
        mode={"single"}
        label={label ?? tc("selectors.date")}
        currentValue={
          field.state.value ? new Date(field.state.value) : undefined
        }
        onChange={(date) => {
          field.handleChange((date as Date).toISOString());
        }}
        minDate={minDate}
      />
      <FieldError errors={errors} />
    </Field>
  );
};
