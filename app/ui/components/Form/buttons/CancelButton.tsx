import { useTranslations } from "next-intl";

import { Button } from "@/app/ui/shadcn/Button";

import { useFormContext } from "..";

type Props = {
  label?: string;
};

export const CancelButton = ({ label }: Props) => {
  const form = useFormContext();

  const t = useTranslations("Common.buttons");

  const buttonLabel = label || t("cancel");

  return (
    <form.Subscribe
      selector={(state) => [state.isSubmitting, state.canSubmit, state.isDirty]}
    >
      {([isSubmitting, canSubmit, isDirty]) => {
        const disabled = isSubmitting || !canSubmit || !isDirty;

        return (
          <Button
            aria-disabled={disabled}
            size={"md"}
            type="button"
            disabled={!isDirty}
            onClick={() => {
              form.reset();
            }}
          >
            {buttonLabel}
          </Button>
        );
      }}
    </form.Subscribe>
  );
};
