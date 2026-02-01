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
    },

    validators: {
      onSubmit: ({ value }) => {
        return validateAtLeastOneSection(value);
      },
      onChange: ({ value }) => {
        return validateAtLeastOneSection(value);
      },
    },

    onSubmit: async ({ value }) => {
      const sectionsToBeImported = value.sections.filter((s) => s.import);
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
          <DialogContent className={"text-text-primary"}>
            <DialogHeader className={"sr-only"}>
              <DialogTitle className={"sr-only"}>
                Import backup dialog
              </DialogTitle>
              <DialogDescription hidden>Import backup dialog</DialogDescription>
            </DialogHeader>
            <h3>{t("importDialogTitle")}:</h3>

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

                          {/*<form.AppField*/}
                          {/*  name={`sections[${index}].records`}*/}
                          {/*  mode="array"*/}
                          {/*>*/}
                          {/*  {(recordsField) => {*/}
                          {/*    return (*/}
                          {/*      <div>*/}
                          {/*        {recordsField.state.value.map(*/}
                          {/*          (record, index) => {*/}
                          {/*            return (*/}
                          {/*              <div key={index}>*/}
                          {/*                {record.createdAt}*/}
                          {/*              </div>*/}
                          {/*            );*/}
                          {/*          }*/}
                          {/*        )}*/}
                          {/*      </div>*/}
                          {/*    );*/}
                          {/*  }}*/}
                          {/*</form.AppField>*/}
                        </div>
                      );
                    })}

                    <FieldError
                      errors={sectionField.state.meta.errors}
                      className="text-md mx-auto mt-2 font-bold"
                    />
                  </div>
                );
              }}
            </form.Field>

            <DialogFooter className="mt-6 gap-4">
              <form.CancelButton />
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

function validateAtLeastOneSection(value: { sections: { import: boolean }[] }) {
  const hasAnySelected = value.sections.some((s) => s.import);

  if (!hasAnySelected) {
    return {
      fields: {
        sections: [{ message: "Select at least one section to import" }],
      },
    };
  }

  return undefined;
}
