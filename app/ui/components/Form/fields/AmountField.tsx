import React from "react";
import { useTranslations } from "next-intl";

import { TextField } from "./common";

interface Props {
  showCalculator?: boolean;
  id?: string;
  disabled?: boolean;
}

export const AmountField = ({
  showCalculator = false,
  id,
  disabled,
}: Props) => {
  const tc = useTranslations("Common");

  return (
    <TextField
      label={tc("inputs.amount")}
      id={id}
      disabled={disabled}
      type="number"
      inputMode="decimal"
      showCalculator={showCalculator}
    />
  );
};
