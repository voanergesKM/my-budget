"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { cn } from "@/app/lib/utils/utils";

import { AvatarUploader } from "@/app/ui/components/AvatarUploader";
import { useAppForm } from "@/app/ui/components/Form";

import ImportBackupDialog from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/ImportBackupDialog";
import { useSendVehicleMutation } from "@/app/(private)/(vehicles)/_hooks/useSendVehicleMutation";
import { createVehicleSchema } from "@/app/lib/schema/vehicle.schema";
import { Vehicle, VehicleFormValues } from "@/app/lib/types/vehicle";

const defaultValues = {
  name: "",
  description: "",
  imageSrc: "",
  group: undefined,
  category: undefined,
  type: "car",
  fuelType: undefined,
  odometer: 1,
  vinCode: "",
} as VehicleFormValues;

function VehicleForm({ vehicleData }: { vehicleData?: Vehicle }) {
  const tc = useTranslations("Common");
  const tv = useTranslations("FormValidations");

  const router = useRouter();

  const schema = createVehicleSchema(tv);

  const { mutateAsync } = useSendVehicleMutation(vehicleData?._id ?? null);

  const formValues = vehicleData ? vehicleData : defaultValues;

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        payload: {
          ...value,
          group: value.group || null,
          category: value.category || null,
        },
      });

      router.back();
    },
  });

  const vehicleType = useStore(form.store, (state) => state.values.type);

  useEffect(() => {
    if (vehicleType === "bicycle") {
      resetVehicleValues(form);
    }
  }, [vehicleType]);

  return (
    <div className={"mx-auto mt-8 max-w-[600px]"}>
      <form.AppForm>
        <form.AppField
          name={"imageSrc"}
          children={(field) => (
            <AvatarUploader
              image={field.state.value}
              onUpload={(src) => {
                field.setValue(src);
              }}
            />
          )}
        />

        <div className={"my-2 ml-auto flex justify-end"}>
          {vehicleData && <ImportBackupDialog vehicleData={vehicleData} />}
        </div>

        <form.AppField
          name={"name"}
          children={(field) => <field.TextField label={tc("inputs.title")} />}
        />

        <form.AppField
          name={"description"}
          children={(field) => (
            <field.TextField label={tc("inputs.description")} />
          )}
        />

        <fieldset
          disabled={!!vehicleData}
          className={cn(vehicleData && "pointer-events-none")}
        >
          <form.AppField name="type">
            {(field) => <field.VehicleTypeSelectField />}
          </form.AppField>

          {vehicleType === "car" && (
            <>
              <form.AppField name="fuelType">
                {(field) => <field.FuelTypeSelectField />}
              </form.AppField>

              <form.AppField name="odometer">
                {(field) => (
                  <field.TextField
                    label={tc("inputs.odometer")}
                    type={"number"}
                  />
                )}
              </form.AppField>

              <form.AppField name="vinCode">
                {(field) => <field.TextField label={tc("inputs.vinCode")} />}
              </form.AppField>
            </>
          )}
        </fieldset>

        <form.AppField name="group">
          {(field) => (
            <field.GroupSelectField
              onChange={() => {
                form.setFieldValue("category", null);
              }}
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => [state.values.group]}>
          {([group]) => {
            return (
              <form.AppField name="category">
                {(field) => (
                  <field.CategoriesSelectField
                    showEmpty
                    group={group}
                    description={tc("selectors.linkVehicleCategoryDesc")}
                  />
                )}
              </form.AppField>
            );
          }}
        </form.Subscribe>

        <form.SubmitButton label={tc("buttons.save")} />
      </form.AppForm>
    </div>
  );
}

export default VehicleForm;

function resetVehicleValues(form: any) {
  form.setFieldValue("fuelType", undefined);
  form.setFieldValue("odometer", 0);
  form.setFieldValue("vinCode", undefined);
}
