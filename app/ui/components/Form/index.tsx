import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { SubmitButton } from "./buttons/SubmitButton";
import {
  DateField,
  SelectField,
  SwitchField,
  TextField,
} from "./fields/common";
import { CategoriesSelectField } from "./fields";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    DateField,
    SwitchField,
    CategoriesSelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
