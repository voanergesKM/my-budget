import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";
import { FieldError } from "@/app/ui/shadcn/Field";

import { useAppForm } from "@/app/ui/components/Form";

import DialogTrigger from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/ImportBackupDialog/DialogTrigger";
import { useParseVehicleBackupMutation } from "@/app/(private)/(vehicles)/_hooks/useParseVehicleBackupMutation";
import { useSendBackupMutation } from "@/app/(private)/(vehicles)/_hooks/useSendBackupMutation";
import { Vehicle } from "@/app/lib/types/vehicle";

function ImportBackupDialog({ vehicleData }: { vehicleData: Vehicle }) {
  const [open, setOpen] = useState(false);

  const t = useTranslations("Vehicles");
  const tc = useTranslations("Common");
  const tv = useTranslations("FormValidations");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: parseBackup, data } = useParseVehicleBackupMutation(() =>
    setOpen(true)
  );

  const { mutateAsync, isPending: sendingBackup } = useSendBackupMutation();

  const form = useAppForm({
    defaultValues: {
      sections:
        data && data.sections
          ? Object.entries(data.sections).map(([key, rows]) => ({
              name: key,
              import: (rows as any[]).length > 0,
              totalRecords: (rows as any[]).length,
              createTransactions: Boolean(vehicleData.category),
              records: rows as any[],
            }))
          : [],

      expenseCategories:
        data && data.expenseCategories
          ? (data.expenseCategories as {
              id: string;
              name: string;
              categoryName: string;
              priority: number;
              color: string;
            }[])
          : [],
    },

    validators: {
      onSubmit: ({ value }) => validateImportForm(value, tv),
    },

    onSubmit: async ({ value }) => {
      const sectionsToBeImported = value.sections.filter((s) => s.import);

      const expenses = sectionsToBeImported.findIndex(
        (s) => s.name === "expenses"
      );

      sectionsToBeImported[expenses].records = sectionsToBeImported[
        expenses
      ].records.map((r) => {
        const targetCategory = value.expenseCategories.find(
          (c) => c.id === r.costTypeId
        );
        return {
          ...r,
          category: targetCategory!.categoryName,
        };
      });

      const importedSectionsNames = sectionsToBeImported.map((s) => s.name);

      const payload = {
        sections: sectionsToBeImported,
        vehicleId: vehicleData._id,
        group: vehicleData.group,
        category: vehicleData.category,
        importedSectionsNames,
      };

      await mutateAsync(payload);

      form.reset();

      onOpenChange(false);
    },
  });

  const onOpenChange = (value: boolean) => {
    setOpen(value);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    parseBackup(formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <DialogTrigger onSelect={triggerFileInput} />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <form.AppForm>
          <DialogContent className={"text-text-primary"} variant={"full"}>
            <DialogHeader className={"sr-only"}>
              <DialogTitle className={"sr-only"}>
                Import backup dialog
              </DialogTitle>
              <DialogDescription hidden>Import backup dialog</DialogDescription>
            </DialogHeader>
            <h3>{t("importDialogTitle")}:</h3>

            <div className={"overflow-y-auto"}>
              <form.Field name="sections" mode="array">
                {(sectionField) => {
                  return (
                    <div className="space-y-4">
                      {sectionField.state.value.map((section, index) => {
                        return (
                          <div
                            key={index}
                            className={
                              "flex flex-col gap-3 rounded-sm border-[1px] p-4"
                            }
                          >
                            <form.AppField
                              name={`sections[${index}].import`}
                              children={(field) => (
                                <field.CheckboxField
                                  label={t(section.name)}
                                  fieldDescription={`${section.totalRecords} ${t("record", { count: section.records.length })}`}
                                  onChange={(value) => {
                                    form.validateField("sections", "change");
                                  }}
                                />
                              )}
                            />

                            {!!vehicleData.category && (
                              <form.AppField
                                name={`sections[${index}].createTransactions`}
                                children={(field) => (
                                  <field.SwitchField
                                    fieldDescription={tc(
                                      "switch.createImportedTransactionDesc"
                                    )}
                                    label={tc(
                                      "switch.createImportedTransaction",
                                      { count: section.records.length }
                                    )}
                                  />
                                )}
                              />
                            )}
                          </div>
                        );
                      })}

                      <FieldError
                        errors={sectionField.state.meta.errors}
                        className="text-md mx-auto mt-2 font-bold"
                      />

                      <form.Field name="expenseCategories" mode="array">
                        {(categoryField) => {
                          return (
                            <div
                              className={
                                "flex flex-col gap-3 rounded-sm border-[1px] p-4"
                              }
                            >
                              {categoryField.state.value.map(
                                (category, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className={
                                        "grid grid-cols-[40%_1fr] items-center gap-x-1 gap-y-0 text-sm text-text-primary"
                                      }
                                    >
                                      {category.name}
                                      <form.AppField
                                        name={`expenseCategories[${index}].categoryName`}
                                        children={(field) => (
                                          <field.ServiceCategorySelectField
                                            label={" "}
                                          />
                                        )}
                                      />
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          );
                        }}
                      </form.Field>
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <DialogFooter className="mt-6 gap-4">
              <form.SubmitButton />
            </DialogFooter>
          </DialogContent>
        </form.AppForm>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={handleUpload}
          className="hidden"
        />
      </Dialog>
    </>
  );
}

export default ImportBackupDialog;

function validateImportForm(
  value: {
    sections: { import: boolean }[];
    expenseCategories: { categoryName?: string }[];
  },
  t: (key: string, values?: any) => string
) {
  const fields: Record<string, any> = {};

  const hasAnySelected = value.sections.some((s) => s.import);

  if (!hasAnySelected) {
    fields["sections"] = [{ message: t("atLeastOneSectionToImport") }];
  }

  value.expenseCategories?.forEach((cat, index) => {
    if (!cat.categoryName?.trim()) {
      fields[`expenseCategories[${index}].categoryName`] = {
        message: t("categoryRequired"),
      };
    }
  });

  return Object.keys(fields).length ? { fields } : undefined;
}
