import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

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

import {
  getDialogTitle,
  recordConfig,
} from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog/utils";
import { useSendRecordMutation } from "@/app/(private)/(vehicles)/_hooks/useSendRecordMutation";
import { FuelRecordType, ServiceRecordType, Vehicle, } from "@/app/lib/types/vehicle";
import { AddVehicleIcon } from "@/app/ui/icons";

type DialogProps = {
  type: "fuel" | "service";
  vehicle: Vehicle;
  recordData: null | FuelRecordType | ServiceRecordType;
  setRecordData: (
    recordData: null | FuelRecordType | ServiceRecordType
  ) => void;
};

function RecordDialog({
  type,
  vehicle,
  recordData,
  setRecordData,
}: DialogProps) {
  const config = recordConfig[type];
  const FormComponent = config.FormComponent;

  const tv = useTranslations("FormValidations");
  const tVehicles = useTranslations("Vehicles");

  const [open, setOpen] = useState(false);

  const isEdit = Boolean(recordData);
  const vehicleOdometer = vehicle.currentOdometer || vehicle.odometer || 0;

  const schema = useMemo(
    () => config.createSchema(tv, vehicleOdometer, isEdit),
    [config, tv, vehicleOdometer, isEdit]
  );

  const formValues = useMemo(() => {
    return recordData
      ? config.getFormValues(recordData as any)
      : config.getDefaultValues(vehicleOdometer);
  }, [recordData, vehicleOdometer, config]);

  useEffect(() => {
    if (recordData) {
      setOpen(true);
    }
  }, [recordData]);

  useEffect(() => {
    if (open) {
      form.reset(formValues);
    }
  }, [formValues, open]);

  const { mutateAsync: sendRecord } = useSendRecordMutation(
    vehicle._id,
    isEdit,
    type
  );

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      console.log("🚀 ~ onSubmit ~ value: ", value);
      let record = { ...value };

      if ("isMissed" in value) {
        const { isMissed, trip, fullTank, ...rest } = value;
        record = {
          ...rest,
          trip: isMissed ? 0 : trip,
          fullTank: isMissed ? false : fullTank,
          isMissed,
        };
      }

      await sendRecord({
        record,
        type,
        vehicleId: vehicle._id,
      });

      setOpen(false);
      setRecordData(null);

      form.reset(config.getDefaultValues(vehicleOdometer));
    },
  });

  const onOpenChange = (open: boolean) => {
    setOpen(open);

    if (!open) {
      form.reset(config.getDefaultValues(vehicleOdometer));

      setRecordData(null);
    }
  };

  const dialogTitle = getDialogTitle(tVehicles, type, isEdit);
  const formKey = isEdit ? recordData!._id : `${type}-create`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"icon"}>
          <AddVehicleIcon />
        </Button>
      </DialogTrigger>

      <DialogContent variant={"full"}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className={"sr-only"}>
            Add {type} record
          </DialogDescription>
        </DialogHeader>

        <form.AppForm key={formKey}>
          <div
            className={"mx-[-16px] overflow-auto px-4"}
            style={{
              overflowY: "auto",
            }}
          >
            <FormComponent
              form={form}
              isEdit={isEdit}
              vehicleOdometer={vehicleOdometer}
            />
          </div>

          <DialogFooter className={"mt-6 gap-4"}>
            <form.SubmitButton />
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

export default RecordDialog;
