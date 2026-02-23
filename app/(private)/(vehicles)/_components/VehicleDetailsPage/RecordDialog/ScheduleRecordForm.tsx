import React from "react";
import { useTranslations } from "next-intl";

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

  return (
    <div className={"flex flex-col gap-2"}>
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
    </div>
  );
}

export default ScheduleRecordForm;
