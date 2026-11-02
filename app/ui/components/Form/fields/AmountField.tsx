import React from "react";
import { useTranslations } from "next-intl";

import { TextField } from "./common";

interface Props {
  showCalculator?: boolean;
}

export const AmountField = ({ showCalculator = false }: Props) => {
  const tc = useTranslations("Common");

  return (
    <TextField
      label={tc("inputs.amount")}
      type="number"
      inputMode="decimal"
      showCalculator={showCalculator}
    />
  );
};
