import { useState } from "react";

export type FieldError = { field: string; message: string };

export const useFormErrors = () => {
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const getFieldError = (key: string) => {
    const error = formErrors.find((e) => e.field === key);

    return {
      hasError: !!error,
      helperText: error?.message,
    };
  };

  const clearFieldError = (key: string) => {
    setFormErrors((prev) => prev.filter((e) => e.field !== key));
  };

  return {
    formErrors,
    setFormErrors,
    getFieldError,
    clearFieldError,
  };
};
