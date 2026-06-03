import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { cn } from "@/app/lib/utils/utils";

import { VEHICLE_REMIND_STATUS } from "@/app/lib/constants";

type FormProps = {
  form: any;
  isEdit: boolean;
  vehicleOdometer: number;
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

function ScheduleRecordForm({ form, isEdit, vehicleOdometer }: FormProps) {
  const tt = useTranslations("Table");
  const tc = useTranslations("Common");
  const ts = useTranslations("Status");

  const recordStatus = useStore(
    form.store,
    (state: any) => state.values.recordStatus
  );

  const status = useStore(form.store, (state: any) => state.values.status);
  const repeat = useStore(form.store, (state: any) => state.values.repeat);

  const isFormDisabled = !!recordStatus && recordStatus === "completed";
  const shouldShowRepeat = status === "completed" && !isFormDisabled && isEdit;

  return (
    <fieldset
      disabled={isFormDisabled}
      className={cn(
        isFormDisabled && "pointer-events-none",
        "space-y-3 md:space-y-4"
      )}
    >
      <form.AppField
        name={"title"}
        children={(field: any) => (
          <field.TextField label={tc("inputs.title")} />
        )}
      />

      <div
        className={"flex flex-col items-end gap-4 md:flex-row md:items-start"}
      >
        <form.AppField
          name={"category"}
          children={(field: any) => (
            <field.ServiceCategorySelectField label={tt("category")} />
          )}
        />

        <form.AppField
          name={"status"}
          children={(field: any) => (
            <field.SelectField<String, string>
              label={tt("status")}
              options={VEHICLE_REMIND_STATUS}
              getValue={(c: string) => c}
              displayValue={(c: string) => c && ts(c)}
              renderOption={(c: string) => ts(c)}
            />
          )}
        />
      </div>

      <div className={"flex items-start gap-2 md:gap-4"}>
        <form.AppField
          name={"triggerOdometer"}
          children={(field: any) => (
            <field.TextField type="number" label={tt("triggerOdometer")} />
          )}
        />

        <form.AppField
          name={"triggerDate"}
          children={(field: any) => (
            <field.DateField label={tt("triggerDate")} minDate={tomorrow} />
          )}
        />
      </div>

      {shouldShowRepeat && (
        <div className="space-y-3 md:space-y-4">
          <form.AppField
            name="repeat"
            children={(field: any) => (
              <field.CheckboxField
                label={tc("inputs.repeat")}
                fieldDescription={tc("inputs.repeatDescription")}
                onChange={() => {
                  form.validateField("month", "change");
                  form.validateField("nextOdometer", "change");
                }}
              />
            )}
          />

          {repeat && (
            <div className="flex items-start gap-2 md:gap-4">
              <form.AppField
                name="nextOdometer"
                children={(field: any) => (
                  <field.TextField
                    type="number"
                    label={tc("inputs.remindAtOdometer")}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const { valueAsNumber } = event.target;
                      field.handleChange(valueAsNumber || 0);
                      form.validateField("month", "change");
                      form.validateField("nextOdometer", "change");
                    }}
                  />
                )}
              />

              <form.AppField
                name="month"
                children={(field: any) => (
                  <field.TextField
                    type="number"
                    label={tc("inputs.remindAfterMonths")}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const { valueAsNumber } = event.target;
                      field.handleChange(valueAsNumber || 0);
                      form.validateField("month", "change");
                      form.validateField("nextOdometer", "change");
                    }}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}
    </fieldset>
  );
}

export default ScheduleRecordForm;
