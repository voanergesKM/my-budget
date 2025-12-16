import { Button } from "@/app/ui/shadcn/Button";

import { useFormContext } from "..";

export const SubmitButton = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => {
        return (
          <Button
            aria-disabled={!canSubmit}
            onClick={form.handleSubmit}
            disabled={isSubmitting || !canSubmit}
            isLoading={isSubmitting}
            size={"md"}
            className="px-10"
          >
            {label}
          </Button>
        );
      }}
    </form.Subscribe>
  );
};
