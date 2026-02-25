"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { cn } from "@/app/lib/utils/utils";

import { AvatarUploader } from "@/app/ui/components/AvatarUploader";
import Paper from "@/app/ui/components/common/Paper";
import { useAppForm } from "@/app/ui/components/Form";

import ImportBackupDialog from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/ImportBackupDialog";
import { useSendVehicleMutation } from "@/app/(private)/(vehicles)/_hooks/useSendVehicleMutation";
import { DATE_GAP_OPTIONS } from "@/app/lib/constants";
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
  reminderSettings: {
    default: {
      dateGapDays: 14,
      odometerGapKm: 1000,
    },
  },
} satisfies VehicleFormValues;

function VehicleForm({ vehicleData }: { vehicleData?: Vehicle }) {
  const tc = useTranslations("Common");
  const tv = useTranslations("FormValidations");
  const tr = useTranslations("RemindInterval");

  const router = useRouter();

  const schema = createVehicleSchema(tv);

  const { mutateAsync } = useSendVehicleMutation(vehicleData?._id ?? null);

  const formValues = vehicleData ? vehicleData : defaultValues;

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onSubmit: schema as any,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        payload: {
          ...value,
          group: value.group || null,
          category: value.category || null,
          ...(!vehicleData && { currentOdometer: value.odometer }),
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
    <Paper
      className={
        "mx-auto mt-4 flex w-full max-w-[1024px] flex-col gap-2 lg:p-6 xl:p-10"
      }
    >
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

        {vehicleData && (
          <div className={"my-2 ml-auto flex justify-end"}>
            <ImportBackupDialog vehicleData={vehicleData} />
          </div>
        )}

        <div className={"mb-4 flex flex-col gap-2 md:gap-3"}>
          <form.AppField
            name={"name"}
            children={(field) => (
              <field.TextField
                label={tc("inputs.title")}
                className={"lg:w-1/2"}
              />
            )}
          />

          <form.AppField
            name={"description"}
            children={(field) => (
              <field.TextAreaField
                label={tc("inputs.description")}
                className={"lg:w-2/3"}
              />
            )}
          />
        </div>

        <fieldset
          disabled={!!vehicleData}
          className={cn(vehicleData && "pointer-events-none")}
        >
          <div className={"flex flex-row gap-3 md:gap-4"}>
            <form.AppField name="type">
              {(field) => <field.VehicleTypeSelectField />}
            </form.AppField>

            {vehicleType === "car" && (
              <form.AppField name="fuelType">
                {(field) => <field.FuelTypeSelectField />}
              </form.AppField>
            )}
          </div>
          {vehicleType === "car" && (
            <div className={"mb-4 flex flex-col gap-2 md:flex-row md:gap-4"}>
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
            </div>
          )}
        </fieldset>

        <div className={"mb-4 flex flex-col gap-2 md:flex-row md:gap-4"}>
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
        </div>

        <h3 className={"mt-2 text-center text-xl font-bold text-text-primary"}>
          {tc("titles.settings")}
        </h3>

        <div className={"mb-4 mt-3"}>
          <p className={"text-md mb-2 font-bold text-text-primary"}>
            {tc("titles.reminderSettings")}
          </p>

          <div className={"flex flex-col gap-3 md:flex-row"}>
            <form.AppField
              name={"reminderSettings.default.odometerGapKm"}
              children={(field) => (
                <field.TextField
                  label={tc("inputs.remindAfterKilometers")}
                  type={"number"}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const { value, valueAsNumber } = event.target;
                    form.setFieldValue(
                      "reminderSettings.default.odometerGapKm",
                      //@ts-ignore
                      Number.isNaN(valueAsNumber) ? "" : valueAsNumber
                    );
                    form.validateField(
                      "reminderSettings.default.dateGapDays",
                      "change"
                    );
                  }}
                />
              )}
            />

            <form.AppField
              name={"reminderSettings.default.dateGapDays"}
              children={(field) => (
                <field.SelectField<Number, { value: number; label: string }>
                  label={tc("inputs.remindBefore")}
                  options={[{ value: 0, label: "Never" }, ...DATE_GAP_OPTIONS]}
                  renderOption={(option) => tr(option.value.toString())}
                  getValue={(value) => value.value}
                  displayValue={(value) =>
                    value?.label ? tr(value.value.toString()) : ""
                  }
                  onChange={(value) => {
                    form.validateField(
                      "reminderSettings.default.odometerGapKm",
                      "change"
                    );
                  }}
                />
              )}
            />
          </div>
        </div>

        <form.SubmitButton
          label={tc("buttons.save")}
          className={"md:ml-auto md:w-fit"}
        />
      </form.AppForm>
    </Paper>
  );
}

export default VehicleForm;

function resetVehicleValues(form: any) {
  form.setFieldValue("fuelType", undefined);
  form.setFieldValue("odometer", 0);
  form.setFieldValue("vinCode", undefined);
}
