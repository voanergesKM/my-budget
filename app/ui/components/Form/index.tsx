import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import {
  DateField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "./fields/common";
import { CancelButton, SubmitButton } from "./buttons";
import {
  AmountField,
  AmountInBaseCurrency,
  CategoriesSelectField,
  CurrencySeletcField,
  UnitSelectorField,
} from "./fields";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    AmountField,
    TextField,
    TextAreaField,
    SelectField,
    DateField,
    SwitchField,
    CategoriesSelectField,
    CurrencySeletcField,
    UnitSelectorField,
  },
  formComponents: {
    AmountInBaseCurrency,
    SubmitButton,
    CancelButton,
  },
  fieldContext,
  formContext,
});
