import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";
import { ChevronsUpDown } from "lucide-react";

import { formatWithTime } from "@/app/lib/utils/dateUtils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";

export const TransactionMetaData = ({ form }: { form: any }) => {
  const tc = useTranslations("Common");
  const totalAmount = useStore(
    form.store,
    (state: any) => state.values.totalAmount
  );
  const currency = useStore(form.store, (state: any) => state.values.currency);
  const currentDate = useStore(
    form.store,
    (state: any) => state.values.createdAt
  );

  return (
    <Collapsible>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {formatWithTime(currentDate)}
        </span>
        <span className="text-sm text-muted-foreground">
          {totalAmount} {currency}
        </span>
        <CollapsibleTrigger asChild>
          <Button
            size="icon"
            className="h-8 w-8 flex-shrink-0 rounded-full p-1"
            aria-label="Toggle collapsible"
          >
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="mt-4 md:flex md:space-x-4">
          <div className="flex items-start gap-2">
            <form.AppField
              name="createdAt"
              children={(field: any) => (
                <field.DateField
                  label={tc("selectors.date")}
                  onChange={(date: Date) => {
                    field.handleChange(date.toISOString());
                    form.setFieldValue(
                      "time",
                      new Date(date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    );
                  }}
                />
              )}
            />

            <div>
              <form.AppField
                name="time"
                children={(field: any) => (
                  <field.TextField
                    type="time"
                    label="Time"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const time = new Date(currentDate).setHours(
                        Number(event.target.value.split(":")[0]),
                        Number(event.target.value.split(":")[1])
                      );
                      form.setFieldValue("time", event.target.value);
                      form.setFieldValue("createdAt", time);
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex-1">
            <form.AppField name="currency">
              {(field: any) => <field.CurrencySeletcField />}
            </form.AppField>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
