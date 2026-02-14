import React, { useEffect, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/shadcn/Dialog";

import { useAppForm } from "@/app/ui/components/Form";

import { useSendRecordMutation } from "@/app/(private)/(vehicles)/_hooks/useSendRecordMutation";
import { createFuelRecordSchema } from "@/app/lib/schema/vehicleRecord.schema";
import { FuelRecordType, Vehicle } from "@/app/lib/types/vehicle";
import { AddVehicleIcon } from "@/app/ui/icons";

type DialogProps = {
  type: "fuel" | "service";
  vehicle: Vehicle;
  recordData: null | FuelRecordType;
  setRecordData: (recordData: null | FuelRecordType) => void;
};

function RecordDialog({
  type,
  vehicle,
  recordData,
  setRecordData,
}: DialogProps) {
  const [open, setOpen] = useState(false);

  const format = useFormatter();

  const t = useTranslations("Vehicles");
  const tt = useTranslations("Table");
  const tv = useTranslations("FormValidations");
  const tc = useTranslations("Common");

  const vehicleOdometer = vehicle.currentOdometer || vehicle.odometer || 0;

  const isEdit = Boolean(recordData);

  useEffect(() => {
    if (recordData) {
      setOpen(true);
    }
  }, [recordData]);

  const { mutateAsync: sendRecord } = useSendRecordMutation(
    vehicle._id,
    isEdit,
    type
  );

  const onOpenChange = (open: boolean) => {
    setOpen(open);

    if (!open) {
      form.reset(getDefaultFormValues(vehicleOdometer));
      setRecordData(null);
    }
  };

  const schema = createFuelRecordSchema(tv, vehicleOdometer, isEdit);

  const formValues = useMemo(() => {
    return recordData
      ? getRecordFormValues(recordData)
      : getDefaultFormValues(vehicleOdometer);
  }, [recordData, vehicleOdometer]);

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { isMissed, trip, fullTank, ...rest } = value;
      const record = {
        ...rest,
        trip: isMissed ? 0 : trip,
        fullTank: isMissed ? false : fullTank,
        isMissed,
      };

      await sendRecord({
        record,
        type,
        vehicleId: vehicle._id,
      });

      setOpen(false);
      setRecordData(null);

      form.reset(getDefaultFormValues(vehicleOdometer));
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(formValues);
    }
  }, [formValues, open]);

  const dialogTitle = getDialogTitle(type, false);

  const isMissed = useStore(form.store, (state) => state.values.isMissed);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"icon"}>
          <AddVehicleIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form.AppForm key={recordData?._id || "create"}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription className={"sr-only"}>
              Add {type} record
            </DialogDescription>
          </DialogHeader>

          <div
            className={"mx-[-16px] px-4"}
            style={{
              maxHeight: "50vh",
              overflowY: "auto",
            }}
          >
            <p
              className={cn(
                "mb-4 shrink-0 text-text-secondary md:basis-1/2",
                isEdit && "hidden"
              )}
            >
              {t("lastOdometer")}: {format.number(vehicleOdometer || 0)} km
            </p>

            <div
              className={"flex flex-col md:flex-row md:items-center md:gap-4"}
            >
              <form.AppField
                name={"odometer"}
                children={(field) => (
                  <field.TextField
                    type="number"
                    disabled={isEdit}
                    label={tt("currentOdometer")}
                    onChange={(event) => {
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
                children={(field) => (
                  <field.DateField label={tc("selectors.date")} />
                )}
              />
            </div>

            <div
              className={
                "flex flex-col items-end gap-4 md:flex-row md:items-center"
              }
            >
              <div className={"flex w-full gap-4"}>
                <form.AppField
                  name={"liters"}
                  children={(field) => (
                    <field.TextField type="number" label={tt("liters")} />
                  )}
                />

                <form.AppField
                  name={"amount"}
                  children={(field) => (
                    <field.TextField type="number" label={tt("amount")} />
                  )}
                />
              </div>
            </div>

            <form.AppField
              name={"trip"}
              children={(field) => (
                <field.TextField
                  type="number"
                  label={tt("trip")}
                  className={cn("max-w-[49%]", isMissed && "hidden")}
                  disabled={isEdit}
                  onChange={(event) => {
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
                children={(field) => (
                  <field.CheckboxField
                    disabled={isEdit}
                    label={tt("isMissed")}
                    onChange={(value) => {
                      form.validateField("odometer", "change");
                      form.validateField("trip", "change");
                    }}
                  />
                )}
              />

              <form.AppField
                name={"fullTank"}
                children={(field) => (
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
              children={(field) => <field.TextField label={tt("city")} />}
            />

            <form.AppField
              name={"notes"}
              children={(field) => <field.TextAreaField label={tt("notes")} />}
            />
          </div>

          <DialogFooter className={"mt-6 gap-4"}>
            <form.CancelButton />
            <form.SubmitButton />
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

export default RecordDialog;

function getDialogTitle(type: string, isEdit: boolean) {
  const t = useTranslations("Vehicles");

  switch (type) {
    case "fuel":
      return t("fuelRecordDialogTitle", { isEdit: isEdit.toString() });

    default:
      return "";
  }
}

function getRecordFormValues(recordData: FuelRecordType) {
  return {
    _id: recordData._id,
    odometer: recordData.odometer,
    liters: recordData.liters,
    amount: recordData.amount,
    fullTank: recordData.fullTank,
    city: recordData.city || "",
    notes: recordData.notes || "",
    createdAt: recordData.createdAt,
    trip: recordData.trip || 0,
    transaction: recordData.transaction,
    isMissed: recordData.isMissed,
  };
}

function getDefaultFormValues(vehicleOdometer: number) {
  return {
    odometer: vehicleOdometer,
    liters: 0,
    amount: 0,
    fullTank: false,
    city: "",
    notes: "",
    createdAt: new Date().toISOString(),
    trip: 0,
    isMissed: false,
  };
}
