import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

type FormProps = {
  form: any;
  isEdit: boolean;
  vehicleOdometer: number;
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

function ServiceRecordForm({ form, isEdit, vehicleOdometer }: FormProps) {
  const tt = useTranslations("Table");
  const tc = useTranslations("Common");

  const remind = useStore(form.store, (state: any) => state.values.remind);
  const odometer = useStore(form.store, (state: any) => state.values.odometer);

  function revalidateAllRemindFields() {
    form.validateField("remindAtDate", "change");
    form.validateField("remindAtOdometer", "change");
    form.validateField("month", "change");
    form.validateField("trip", "change");
  }

  function resetAllRemindFieldValues() {
    form.setFieldValue("remindAtDate", "");
    form.setFieldValue("remindAtOdometer", 0);
    form.setFieldValue("month", 0);
    form.setFieldValue("trip", 0);
  }

  return (
    <div className={"flex flex-col gap-3 md:gap-4"}>
      <form.AppField
        name={"title"}
        children={(field: any) => (
          <field.TextField label={tc("inputs.title")} />
        )}
      />

      <div
        className={
          "flex flex-col items-end gap-3 md:flex-row md:items-start md:gap-4"
        }
      >
        <form.AppField
          name={"category"}
          children={(field: any) => (
            <field.ServiceCategorySelectField label={tt("category")} />
          )}
        />

        <form.AppField
          name={"amount"}
          children={(field: any) => (
            <field.TextField type="number" label={tt("amount")} />
          )}
        />
      </div>

      <div className={"flex items-start gap-2 md:gap-4"}>
        <form.AppField
          name={"odometer"}
          children={(field: any) => (
            <field.TextField
              type="number"
              disabled={isEdit}
              label={tt("odometer")}
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

      <form.AppField
        name={"notes"}
        children={(field: any) => <field.TextAreaField label={tt("notes")} />}
      />

      {!isEdit && (
        <form.AppField
          name="remind"
          children={(field: any) => (
            <field.CheckboxField
              label={tc("inputs.vehicleRemind")}
              fieldDescription={tc("inputs.vehicleRemindDescription")}
              onChange={() => {
                revalidateAllRemindFields();
                resetAllRemindFieldValues();
              }}
            />
          )}
        />
      )}

      {remind && (
        <Tabs
          defaultValue={form.getFieldValue("reminderMode")}
          onValueChange={(value) => {
            form.setFieldValue("reminderMode", value);
            revalidateAllRemindFields();
            resetAllRemindFieldValues();
          }}
        >
          <TabsList className="mb-1 mt-3 bg-transparent">
            <TabsTrigger value="relative">
              {tc("buttons.reminderRelative")}
            </TabsTrigger>
            <TabsTrigger value="exact">
              {tc("buttons.reminderExact")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="relative">
            <div className={"flex items-start gap-2 md:gap-4"}>
              <form.AppField
                name={"trip"}
                children={(field: any) => (
                  <field.TextField
                    type="number"
                    disabled={!odometer}
                    label={tc("inputs.remindAfterKilometers")}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const { valueAsNumber } = event.target;
                      field.handleChange(valueAsNumber || 0);

                      const odometer = form.getFieldValue("odometer");
                      form.setFieldValue(
                        "remindAtOdometer",
                        odometer + valueAsNumber || 0
                      );

                      form.validateField("month", "change");
                      form.validateField("trip", "change");
                    }}
                  />
                )}
              />

              <form.AppField
                name={"month"}
                children={(field: any) => (
                  <field.TextField
                    type="number"
                    disabled={isEdit}
                    label={tc("inputs.remindAfterMonths")}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const { valueAsNumber } = event.target;
                      field.handleChange(valueAsNumber || 0);
                      form.validateField("month", "change");

                      if (valueAsNumber >= 1) {
                        const date = new Date();
                        const future = date.setMonth(
                          date.getMonth() + valueAsNumber || 0
                        );

                        form.setFieldValue(
                          "remindAtDate",
                          new Date(future).toISOString()
                        );
                      } else {
                        form.setFieldValue("remindAtDate", "");
                      }

                      form.validateField("trip", "change");
                    }}
                  />
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="exact">
            <div className={"flex gap-2 md:gap-4"}>
              <form.AppField
                name={"remindAtOdometer"}
                children={(field: any) => (
                  <field.TextField
                    type="number"
                    disabled={isEdit}
                    label={tc("inputs.remindAtOdometer")}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const { valueAsNumber } = event.target;
                      field.handleChange(valueAsNumber);
                      form.validateField("remindAtDate", "change");
                    }}
                  />
                )}
              />
              <form.AppField
                name={"remindAtDate"}
                children={(field: any) => (
                  <field.DateField
                    label={tc("inputs.remindAtDate")}
                    minDate={tomorrow}
                    onChange={(value: Date) => {
                      form.validateField("remindAtOdometer", "change");
                    }}
                  />
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default ServiceRecordForm;
