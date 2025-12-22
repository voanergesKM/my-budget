import { useTranslations } from "next-intl";

import { Button } from "@/app/ui/shadcn/Button";

import { useFormContext } from "..";

type Props = {
  label?: string;
  disabled?: boolean;
};

export const SubmitButton = ({ label, disabled }: Props) => {
  const form = useFormContext();

  const t = useTranslations("Common.buttons");

  const buttonLabel = label || t("save");

  const getIsDisabled = (disabledField: boolean): boolean => {
    return disabled || disabledField;
  };

  return (
    <form.Subscribe
      selector={(state) => [state.isSubmitting, state.canSubmit, state.isDirty]}
    >
      {([isSubmitting, canSubmit, isDirty]) => {
        const isFormDisabled = isSubmitting || !canSubmit || !isDirty;
        const disabled = getIsDisabled(isFormDisabled);

        return (
          <Button
            aria-disabled={disabled}
            onClick={form.handleSubmit}
            disabled={disabled}
            isLoading={isSubmitting}
            size={"md"}
            className="px-10"
          >
            {buttonLabel}
          </Button>
        );
      }}
    </form.Subscribe>
  );
};
