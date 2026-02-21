import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { cn } from "@/app/lib/utils/utils";

type FormProps = {
  form: any;
  isEdit: boolean;
  vehicleOdometer: number;
};

function FuelRecordForm({ form, isEdit, vehicleOdometer }: FormProps) {
  const format = useFormatter();

  const t = useTranslations("Vehicles");
  const tt = useTranslations("Table");
  const tc = useTranslations("Common");

  const isMissed = useStore(form.store, (state: any) => state.values.isMissed);

  return (
    <div className={"flex flex-col gap-2"}>
      <p
        className={cn(
          "mb-4 shrink-0 text-text-secondary md:basis-1/2",
          isEdit && "hidden"
        )}
      >
        {t("lastOdometer")}: {format.number(vehicleOdometer || 0)} km
      </p>

      <div
        className={"flex flex-col gap-3 md:flex-row md:items-start md:gap-4"}
      >
        <form.AppField
          name={"odometer"}
          children={(field: any) => (
            <field.TextField
              type="number"
              disabled={isEdit}
              label={tt("currentOdometer")}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { value, valueAsNumber } = event.target;

                form.setFieldValue(
                  "odometer",
                  //@ts-ignore
                  Number.isNaN(valueAsNumber) ? "" : valueAsNumber
                );

                if (!!form.getFieldValue("isMissed")) return;

                if (event.target.valueAsNumber > vehicleOdometer) {
                  form.setFieldValue(
                    "trip",
                    event.target.valueAsNumber - vehicleOdometer
                  );
                }
              }}
            />
          )}
        />

        <form.AppField
          name={"createdAt"}
          children={(field: any) => (
            <field.DateField label={tc("selectors.date")} />
          )}
        />
      </div>

      <div className={"flex w-full gap-4"}>
        <form.AppField
          name={"liters"}
          children={(field: any) => (
            <field.TextField type="number" label={tt("liters")} />
          )}
        />

        <form.AppField
          name={"amount"}
          children={(field: any) => (
            <field.TextField type="number" label={tt("amount")} />
          )}
        />
      </div>

      <form.AppField
        name={"trip"}
        children={(field: any) => (
          <field.TextField
            type="number"
            label={tt("trip")}
            className={cn("max-w-[49%]", isMissed && "hidden")}
            disabled={isEdit}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value, valueAsNumber } = event.target;

              form.setFieldValue(
                "trip",
                //@ts-ignore
                Number.isNaN(valueAsNumber) ? "" : valueAsNumber
              );

              if (!!form.getFieldValue("isMissed")) return;

              if (!Number.isNaN(valueAsNumber)) {
                form.setFieldValue(
                  "odometer",
                  !!valueAsNumber
                    ? vehicleOdometer + valueAsNumber
                    : vehicleOdometer
                );
              }
            }}
          />
        )}
      />

      <div
        className={
          "my-4 flex flex-col items-end gap-4 md:flex-row md:items-center"
        }
      >
        <form.AppField
          name="isMissed"
          children={(field: any) => (
            <field.CheckboxField
              disabled={isEdit}
              label={tt("isMissed")}
              onChange={(value: boolean) => {
                form.validateField("odometer", "change");
                form.validateField("trip", "change");
              }}
            />
          )}
        />

        <form.AppField
          name={"fullTank"}
          children={(field: any) => (
            <field.CheckboxField
              disabled={isEdit}
              label={tt("fullTank")}
              className={cn("w-full", isMissed && "hidden")}
            />
          )}
        />
      </div>

      <form.AppField
        name={"city"}
        children={(field: any) => <field.TextField label={tt("city")} />}
      />

      <form.AppField
        name={"notes"}
        children={(field: any) => <field.TextAreaField label={tt("notes")} />}
      />
    </div>
  );
}

export default FuelRecordForm;
