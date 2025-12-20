import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import {
  DateField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "./fields/common";
import { CancelButton, SubmitButton } from "./buttons";
import { CategoriesSelectField, CurrencySeletcField } from "./fields";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
    SelectField,
    DateField,
    SwitchField,
    CategoriesSelectField,
    CurrencySeletcField,
  },
  formComponents: {
    SubmitButton,
    CancelButton,
  },
  fieldContext,
  formContext,
});
