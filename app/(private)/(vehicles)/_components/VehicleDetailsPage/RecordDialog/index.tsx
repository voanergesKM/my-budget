import React, { useEffect, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

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

  const vehicleOdometer = vehicle.currentOdometer || 0;

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
      form.reset();
    }
  };

  const schema = createFuelRecordSchema(tv);

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
      console.log("🚀 ~ onSubmit ~ value: ", value);
      await sendRecord({
        record: value,
        type,
        vehicleId: vehicle._id,
      });

      setOpen(false);
      setRecordData(null);

      form.reset();
    },
  });

  const dialogTitle = getDialogTitle(type, false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"icon"}>
          <AddVehicleIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form.AppForm>
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
            <div
              className={"flex flex-col md:flex-row md:items-center md:gap-4"}
            >
              <form.AppField
                name={"odometer"}
                children={(field) => (
                  <field.TextField
                    type="number"
                    label={tt("currentOdometer")}
                    onChange={(event) => {
                      const { value, valueAsNumber } = event.target;

                      form.setFieldValue(
                        "odometer",
                        //@ts-ignore
                        Number.isNaN(valueAsNumber) ? "" : valueAsNumber
                      );
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
              <p className={"shrink-0 text-text-secondary md:basis-1/2"}>
                {t("lastOdometer")}: {format.number(vehicleOdometer || 0)} km
              </p>
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

              <div className={"shrink-0 basis-1/3"}>
                <form.AppField
                  name={"fullTank"}
                  children={(field) => (
                    <field.SwitchField label={tt("fullTank")} />
                  )}
                />
              </div>
            </div>

            <div className={"flex flex-col gap-4 md:flex-row md:items-center"}>
              <form.AppField
                name={"trip"}
                children={(field) => (
                  <field.TextField
                    type="number"
                    label={tt("trip")}
                    onChange={(event) => {
                      const { value, valueAsNumber } = event.target;

                      form.setFieldValue(
                        "trip",
                        //@ts-ignore
                        Number.isNaN(valueAsNumber) ? "" : valueAsNumber
                      );
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
              <form.AppField
                name={"createdAt"}
                children={(field) => (
                  <field.DateField label={tc("selectors.date")} />
                )}
              />
            </div>

            <form.AppField
              name={"location"}
              children={(field) => <field.TextField label={tt("location")} />}
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
    location: recordData.location || "",
    notes: recordData.notes || "",
    createdAt: recordData.createdAt,
    trip: 0,
    transaction: recordData.transaction,
  };
}

function getDefaultFormValues(vehicleOdometer: number) {
  return {
    odometer: vehicleOdometer,
    liters: 0,
    amount: 0,
    fullTank: false,
    location: "",
    notes: "",
    createdAt: new Date().toISOString(),
    trip: 0,
  };
}
