import React from "react";
import { useTranslations } from "next-intl";

import { TextField } from "./common";

export const AmountField = () => {
  const tc = useTranslations("Common");

  return (
    <TextField label={tc("inputs.amount")} type="number" inputMode="decimal" />
  );
};
