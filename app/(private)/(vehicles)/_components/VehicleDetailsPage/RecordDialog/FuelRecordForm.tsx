import React, { useRef } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { cn } from "@/app/lib/utils/utils";

import { Vehicle } from "@/app/lib/types/vehicle";

import { calculateFuelAmount, calculatePricePerLiter } from "./fuelCost";

type FormProps = {
  form: any;
  isEdit: boolean;
  vehicleOdometer: number;
  vehicle: Vehicle;
};

function FuelRecordForm({ form, isEdit, vehicleOdometer, vehicle }: FormProps) {
  const format = useFormatter();

  const t = useTranslations("Vehicles");
  const tt = useTranslations("Table");
  const tc = useTranslations("Common");
  const distanceLabel = t(
    vehicle.distanceUnit === "mi"
      ? "distanceUnitMiShort"
      : "distanceUnitKmShort"
  );
  const fuelLabel = vehicle.fuelUnit === "us_gal" ? t("usGallon") : "L";

  const lastEdited = useRef<"amount" | "pricePerLiter">("amount");

  const isMissed = useStore(form.store, (state: any) => state.values.isMissed);

  return (
    <div className={"flex flex-col gap-3 md:gap-4"}>
      <p
        className={cn(
          "mb-4 shrink-0 text-text-secondary md:basis-1/2",
          isEdit && "hidden"
        )}
      >
        {t("lastOdometer")}: {format.number(vehicleOdometer || 0)}{" "}
        {distanceLabel}
      </p>

      <div
        className={"flex flex-col gap-3 md:flex-row md:items-start md:gap-4"}
      >
        <form.AppField
          name={"odometer"}
          children={(field: any) => (
            <field.TextField
              type="number"
              step="any"
              allowEmpty
              hideInitialZero={!isEdit}
              disabled={isEdit}
              label={`${tt("currentOdometer")} (${distanceLabel})`}
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

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <form.AppField name="liters">
          {(field: any) => (
            <field.TextField
              type="number"
              step="any"
              label={`${t("fuelVolume")} (${fuelLabel})`}
              allowEmpty
              hideInitialZero={!isEdit}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const liters = Number.isNaN(event.target.valueAsNumber)
                  ? ""
                  : event.target.valueAsNumber;
                if (lastEdited.current === "pricePerLiter") {
                  form.setFieldValue(
                    "amount",
                    calculateFuelAmount(
                      liters,
                      form.getFieldValue("pricePerLiter")
                    )
                  );
                } else {
                  form.setFieldValue(
                    "pricePerLiter",
                    calculatePricePerLiter(form.getFieldValue("amount"), liters)
                  );
                }
              }}
            />
          )}
        </form.AppField>
        <form.AppField name="pricePerLiter">
          {(field: any) => (
            <field.TextField
              type="number"
              step="any"
              label={`${t("fuelPricePerUnit")} (${fuelLabel})`}
              allowEmpty
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                lastEdited.current = "pricePerLiter";
                const price = Number.isNaN(event.target.valueAsNumber)
                  ? ""
                  : event.target.valueAsNumber;
                form.setFieldValue(
                  "amount",
                  calculateFuelAmount(form.getFieldValue("liters"), price)
                );
              }}
            />
          )}
        </form.AppField>
        <form.AppField name="amount">
          {(field: any) => (
            <field.TextField
              type="number"
              step="any"
              label={tt("amount")}
              allowEmpty
              hideInitialZero={!isEdit}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                lastEdited.current = "amount";
                const amount = Number.isNaN(event.target.valueAsNumber)
                  ? ""
                  : event.target.valueAsNumber;
                form.setFieldValue(
                  "pricePerLiter",
                  calculatePricePerLiter(amount, form.getFieldValue("liters"))
                );
              }}
            />
          )}
        </form.AppField>
      </div>

      <form.AppField
        name={"trip"}
        children={(field: any) => (
          <field.TextField
            type="number"
            step="any"
            allowEmpty
            hideInitialZero={!isEdit}
            label={`${tt("trip")} (${distanceLabel})`}
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
