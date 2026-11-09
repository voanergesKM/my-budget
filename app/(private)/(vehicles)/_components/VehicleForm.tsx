"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";

import { AvatarUploader } from "@/app/ui/components/AvatarUploader";
import Paper from "@/app/ui/components/common/Paper";
import { useAppForm } from "@/app/ui/components/Form";

import ImportBackupDialog from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/ImportBackupDialog";
import { useSendVehicleMutation } from "@/app/(private)/(vehicles)/_hooks/useSendVehicleMutation";
import {
  DATE_GAP_OPTIONS,
  VEHICLE_TRANSACTION_TYPES,
} from "@/app/lib/constants";
import { createVehicleSchema } from "@/app/lib/schema/vehicle.schema";
import { Vehicle, VehicleFormValues } from "@/app/lib/types/vehicle";
import { convertDistance } from "@/app/lib/vehicle/units";

const defaultValues = {
  name: "",
  description: "",
  imageSrc: "",
  group: undefined,
  category: undefined,
  transactionCategories: {} as NonNullable<
    VehicleFormValues["transactionCategories"]
  >,
  type: "car",
  distanceUnit: "km",
  fuelUnit: "l",
  showMetricUnits: false,
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
  const tCategories = useTranslations("VehicleExpenseCategory");
  const tVehicles = useTranslations("Vehicles");

  const router = useRouter();

  const schema = useMemo(() => createVehicleSchema(tv), [tv]);

  const { mutateAsync } = useSendVehicleMutation(vehicleData?._id ?? null);

  const formValues = vehicleData
    ? {
        ...vehicleData,
        distanceUnit: vehicleData.distanceUnit ?? "km",
        fuelUnit: vehicleData.fuelUnit ?? "l",
        showMetricUnits: vehicleData.showMetricUnits ?? false,
        reminderSettings: {
          ...defaultValues.reminderSettings,
          ...vehicleData.reminderSettings,
          default: {
            ...defaultValues.reminderSettings.default,
            ...vehicleData.reminderSettings?.default,
            odometerGapKm: convertDistance(
              vehicleData.reminderSettings?.default?.odometerGapKm ?? 1000,
              "km",
              vehicleData.distanceUnit ?? "km"
            ),
          },
        },
        transactionCategories: vehicleData.transactionCategories ?? {},
      }
    : defaultValues;

  const form = useAppForm({
    defaultValues: formValues,
    validators: {
      onSubmit: schema as any,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        payload: {
          ...value,
          reminderSettings: {
            ...value.reminderSettings,
            default: {
              ...value.reminderSettings.default,
              odometerGapKm: convertDistance(
                value.reminderSettings.default.odometerGapKm,
                value.distanceUnit,
                "km"
              ),
            },
          },
          group: value.group || null,
          category: value.category || null,
          transactionCategories: Object.fromEntries(
            VEHICLE_TRANSACTION_TYPES.map((type) => [
              type,
              value.transactionCategories?.[type] || null,
            ])
          ),
          ...(vehicleData && { odometer: vehicleData.odometer }),
          ...(!vehicleData && { currentOdometer: value.odometer }),
        },
      });

      router.back();
    },
  });

  const vehicleType = useStore(form.store, (state) => state.values.type);
  const distanceUnit = useStore(
    form.store,
    (state) => state.values.distanceUnit
  );
  const fuelUnit = useStore(form.store, (state) => state.values.fuelUnit);

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

        {vehicleData ? (
          <div className={"my-2 ml-auto flex justify-end"}>
            <ImportBackupDialog vehicleData={vehicleData} />
          </div>
        ) : null}

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

        {vehicleType === "car" && (
          <div className="mb-4 space-y-3">
            {vehicleData?.hasHistory ? (
              <div className="text-sm text-text-secondary">
                <p>
                  {tVehicles("distanceUnit")}:{" "}
                  {tVehicles(
                    distanceUnit === "mi" ? "distanceUnitMi" : "distanceUnitKm"
                  )}
                </p>
                <p>
                  {tVehicles("fuelUnit")}:{" "}
                  {tVehicles(
                    fuelUnit === "us_gal" ? "fuelUnitUsGallon" : "fuelUnitLiter"
                  )}
                </p>
                <p>{tVehicles("unitsLocked")}</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <form.AppField name="distanceUnit">
                  {(field) => (
                    <field.SelectField<string, { value: string; label: string }>
                      label={tVehicles("distanceUnit")}
                      options={[
                        { value: "km", label: tVehicles("distanceUnitKm") },
                        { value: "mi", label: tVehicles("distanceUnitMi") },
                      ]}
                      getValue={(option) => option.value}
                      displayValue={(option) => option?.label}
                      renderOption={(option) => option.label}
                      onChange={(unit) => {
                        const previous = form.getFieldValue("distanceUnit");
                        if (
                          unit === previous ||
                          (unit !== "km" && unit !== "mi")
                        )
                          return;
                        const gap = form.getFieldValue(
                          "reminderSettings.default.odometerGapKm"
                        );
                        if (typeof gap === "number")
                          form.setFieldValue(
                            "reminderSettings.default.odometerGapKm",
                            convertDistance(gap, previous, unit)
                          );
                        const odometer = form.getFieldValue("odometer");
                        if (typeof odometer === "number")
                          form.setFieldValue(
                            "odometer",
                            convertDistance(odometer, previous, unit)
                          );
                      }}
                    />
                  )}
                </form.AppField>
                <form.AppField name="fuelUnit">
                  {(field) => (
                    <field.SelectField<string, { value: string; label: string }>
                      label={tVehicles("fuelUnit")}
                      options={[
                        { value: "l", label: tVehicles("fuelUnitLiter") },
                        {
                          value: "us_gal",
                          label: tVehicles("fuelUnitUsGallon"),
                        },
                      ]}
                      getValue={(option) => option.value}
                      displayValue={(option) => option?.label}
                      renderOption={(option) => option.label}
                    />
                  )}
                </form.AppField>
              </div>
            )}
            <form.AppField name="showMetricUnits">
              {(field) => (
                <field.CheckboxField label={tVehicles("metricExtra")} />
              )}
            </form.AppField>
          </div>
        )}

        <fieldset
          disabled={!!vehicleData}
          className={cn(vehicleData && "pointer-events-none")}
        >
          <div className={"flex flex-row gap-3 md:gap-4"}>
            <form.AppField
              name="type"
              listeners={{
                onChange: ({ value }) => {
                  if (value === "bicycle") {
                    resetVehicleValues(form);
                  }
                },
              }}
            >
              {(field) => <field.VehicleTypeSelectField />}
            </form.AppField>

            {vehicleType === "car" ? (
              <form.AppField name="fuelType">
                {(field) => <field.FuelTypeSelectField />}
              </form.AppField>
            ) : null}
          </div>
          {vehicleType === "car" ? (
            <div className={"mb-4 flex flex-col gap-2 md:flex-row md:gap-4"}>
              <form.AppField name="odometer">
                {(field) => (
                  <field.TextField
                    label={`${tc("inputs.odometer")} (${tVehicles(distanceUnit === "mi" ? "distanceUnitMiShort" : "distanceUnitKmShort")})`}
                    type={"number"}
                    step="any"
                  />
                )}
              </form.AppField>

              <form.AppField name="vinCode">
                {(field) => <field.TextField label={tc("inputs.vinCode")} />}
              </form.AppField>
            </div>
          ) : null}
        </fieldset>

        <div className={"mb-4 md:w-1/2"}>
          <form.AppField name="group">
            {(field) => (
              <field.GroupSelectField
                onChange={() => {
                  form.setFieldValue("category", null);
                  form.setFieldValue("transactionCategories", {});
                }}
              />
            )}
          </form.AppField>
        </div>

        <Collapsible className="mb-4 rounded-md border border-border p-4">
          <CollapsibleTrigger
            type="button"
            className="flex w-full items-center justify-between gap-2 text-left font-bold text-text-primary"
          >
            {tVehicles("transactionCategories")}
            <ChevronDown className="size-4" aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <p className="text-sm text-text-secondary">
              {tVehicles("transactionCategoriesDesc")}
            </p>
            <form.Subscribe
              selector={(state) => [state.values.group, state.values.category]}
            >
              {([group, category]) => (
                <>
                  <form.AppField name="category">
                    {(field) => (
                      <field.CategoriesSelectField
                        showEmpty
                        group={group}
                        label={tVehicles("categoryTemplate")}
                        description={tVehicles("categoryTemplateDesc")}
                      />
                    )}
                  </form.AppField>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!category}
                    onClick={() => {
                      form.setFieldValue(
                        "transactionCategories",
                        Object.fromEntries(
                          VEHICLE_TRANSACTION_TYPES.map((type) => [
                            type,
                            category,
                          ])
                        )
                      );
                    }}
                  >
                    {tVehicles("fillTransactionCategories")}
                  </Button>
                  <div className="grid gap-4 md:grid-cols-2">
                    {VEHICLE_TRANSACTION_TYPES.map((type) => (
                      <form.AppField
                        key={type}
                        name={`transactionCategories.${type}`}
                      >
                        {(field) => (
                          <field.CategoriesSelectField
                            group={group}
                            showEmpty
                            label={
                              type === "fuel"
                                ? tVehicles("fuel")
                                : tCategories(type)
                            }
                            emptyLabel={tVehicles("noTransactionCategory")}
                          />
                        )}
                      </form.AppField>
                    ))}
                  </div>
                </>
              )}
            </form.Subscribe>
          </CollapsibleContent>
        </Collapsible>

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
                  label={tc("inputs.remindAfterDistance", {
                    unit: tVehicles(
                      distanceUnit === "mi"
                        ? "distanceUnitMiShort"
                        : "distanceUnitKmShort"
                    ),
                  })}
                  type={"number"}
                  step="any"
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
