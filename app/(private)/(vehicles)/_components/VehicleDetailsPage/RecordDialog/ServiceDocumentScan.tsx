import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, FileUp, Trash2 } from "lucide-react";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupById } from "@/app/lib/api";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/Dialog";

import { useAppForm } from "@/app/ui/components/Form";

import { SERVICE_CATEGORIES } from "@/app/lib/constants";
import { Vehicle } from "@/app/lib/types/vehicle";
import { useCurrentUser } from "@/app/ui/context/CurrentUserContext";

import {
  prepareServiceScanRows,
  Scan,
  ScanRow,
  sumScanAmounts,
} from "./serviceScanUtils";

type Row = Omit<ScanRow, "amount"> & { id: string; amount: string | number };

export default function ServiceDocumentScan({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const t = useTranslations("ServiceScan");
  const tc = useTranslations("Common");
  const categories = useTranslations("VehicleExpenseCategory");
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const { data: group } = useQuery({
    queryKey: [QueryKeys.getCurrentGroup, vehicle.group],
    queryFn: () => getGroupById(vehicle.group!),
    enabled: Boolean(vehicle.group),
  });
  const defaultCurrency = vehicle.group
    ? group?.data?.defaultCurrency
    : currentUser?.defaultCurrency;
  const [scan, setScan] = useState<Scan | null>(null);
  const form = useAppForm({
    defaultValues: {
      createdAt: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      odometer: vehicle.currentOdometer || vehicle.odometer || 0,
      rows: [] as Row[],
    },
  });
  const { rows, createdAt, odometer } = useStore(
    form.store,
    (state) => state.values
  );
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const batchId = useRef(crypto.randomUUID());
  const format = (value: number | null) =>
    value === null ? t("unknown") : value.toFixed(2);
  const parts = sumScanAmounts(
    scan?.groups.flatMap((g) => g.parts.map((p) => p.total)) ?? []
  );
  const labor = sumScanAmounts(
    scan?.groups.flatMap((g) => g.labor.map((l) => l.total)) ?? []
  );
  const total = sumScanAmounts([parts, labor]);

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/scan-service-document", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("error"));
      return result.data as Scan;
    },
    onSuccess: (result, file) => {
      setFileName(file.name);
      setScan(result);
      setError("");
      batchId.current = crypto.randomUUID();
      if (
        result.date &&
        /^\d{4}-\d{2}-\d{2}$/.test(result.date) &&
        !Number.isNaN(new Date(result.date).getTime())
      ) {
        form.setFieldValue(
          "createdAt",
          new Date(`${result.date}T12:00:00`).toISOString()
        );
      }
      if (result.odometer !== null)
        form.setFieldValue("odometer", result.odometer);
      form.setFieldValue(
        "rows",
        prepareServiceScanRows(result.groups, t, categories).map((row) => ({
          ...row,
          id: crypto.randomUUID(),
        }))
      );
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/vehicles/service-records/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batchId.current,
          vehicleId: vehicle._id,
          records: rows.map(({ title, category, amount, notes }) => ({
            title,
            category,
            amount: Number(amount),
            notes,
            odometer: Number(odometer),
            createdAt,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.message || t("saveError"));
        Object.assign(error, { status: response.status });
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["vehicleServiceRecords", vehicle._id],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.currentVehicle(vehicle._id)],
      });
      void queryClient.invalidateQueries({
        queryKey: ["vehicleExpensesChart", vehicle._id],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.getTransactionsList],
      });
      Notify.success(t("savedAll"));
      onClose();
    },
    onError: (err) => {
      setError(err.message);
      const status = (err as Error & { status?: number }).status;
      const uncertain = !status || status >= 500;
      setLocked(uncertain);
      if (!uncertain) batchId.current = crypto.randomUUID();
    },
  });
  const valid =
    rows.length > 0 &&
    Boolean(createdAt) &&
    Number.isFinite(new Date(createdAt).getTime()) &&
    Number.isFinite(Number(odometer)) &&
    Number(odometer) >= 0 &&
    rows.every(
      (row) =>
        row.title.trim() &&
        row.title.length <= 500 &&
        row.notes.length <= 10000 &&
        SERVICE_CATEGORIES.includes(row.category) &&
        row.amount !== "" &&
        Number.isFinite(Number(row.amount)) &&
        Number(row.amount) >= 1
    );

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !save.isPending) onClose();
      }}
    >
      <DialogContent
        variant="full"
        className="flex max-h-[100dvh] flex-col text-text-primary md:max-h-[90dvh]"
      >
        <DialogHeader>
          <DialogTitle>{t("scanAction")}</DialogTitle>
          <DialogDescription>{t("review")}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          <label className="block cursor-pointer">
            <input
              className="peer sr-only"
              type="file"
              aria-label={t("upload")}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              disabled={upload.isPending || locked || save.isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) {
                  setError("");
                  upload.mutate(file);
                }
              }}
            />
            <span className="flex items-center gap-3 rounded-lg border border-dashed border-input p-4 transition-colors hover:bg-accent/30 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-text-primary">
                <FileUp className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {fileName ? t("changeFile") : t("chooseFile")}
                </span>
                <span className="block truncate text-xs text-text-secondary">
                  {fileName || t("fileFormats")}
                </span>
              </span>
            </span>
          </label>
          {upload.isPending && <p role="status">{t("loading")}</p>}
          {upload.isError && (
            <div className="flex flex-wrap items-center gap-3">
              <p role="alert" className="text-destructive">
                {upload.error.message}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={locked || save.isPending}
                onClick={() => {
                  if (upload.variables) {
                    setError("");
                    upload.mutate(upload.variables);
                  }
                }}
              >
                {t("retryScan")}
              </Button>
            </div>
          )}
          {error && (
            <p role="alert" className="text-destructive">
              {error}
              {locked && ` ${t("retryOnly")}`}
            </p>
          )}
          {scan && !upload.isPending && (
            <>
              <p className="text-sm font-medium">{t("recognizedTotals")}</p>
              <div className="grid grid-cols-2 gap-2 rounded-md border p-3 text-sm">
                <span>
                  {t("parts")}: {format(parts)}
                </span>
                <span>
                  {t("printed")}: {format(scan.printedParts)}
                </span>
                <span>
                  {t("work")}: {format(labor)}
                </span>
                <span>
                  {t("printed")}: {format(scan.printedLabor)}
                </span>
                <strong>
                  {t("total")}: {format(total)}
                </strong>
                <span>
                  {t("printed")}: {format(scan.printedTotal)}
                </span>
              </div>
              <p className="text-sm">
                {t("preparedTotal")}:{" "}
                {format(
                  sumScanAmounts(
                    rows.map((row) =>
                      row.amount === "" || !Number.isFinite(Number(row.amount))
                        ? null
                        : Number(row.amount)
                    )
                  )
                )}
              </p>
              {scan.currency && (
                <p className="text-sm">
                  {t("currency")}: {scan.currency}
                </p>
              )}
              {!defaultCurrency && (
                <p role="status">{t("currencyUnavailable")}</p>
              )}
              {scan.currency &&
                defaultCurrency &&
                scan.currency !== defaultCurrency && (
                  <p role="alert">
                    {t("currencyMismatch", { currency: defaultCurrency })}
                  </p>
                )}
              <div className="grid grid-cols-2 gap-3">
                <form.AppField name="createdAt">
                  {(field) => (
                    <field.DateField
                      label={tc("selectors.date")}
                      disabled={locked || save.isPending}
                      onChange={(value: Date) => {
                        const selected = new Date(value);
                        selected.setHours(12, 0, 0, 0);
                        field.handleChange(selected.toISOString());
                      }}
                    />
                  )}
                </form.AppField>
                <form.AppField name="odometer">
                  {(field) => (
                    <field.TextField
                      type="number"
                      min="0"
                      label={tc("inputs.odometer")}
                      disabled={locked || save.isPending}
                    />
                  )}
                </form.AppField>
              </div>
              {rows.map((row, index) => (
                <Collapsible
                  key={row.id}
                  className="space-y-2 rounded-md border p-3"
                >
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <form.AppField name={`rows[${index}].category`}>
                        {(field) => (
                          <field.ServiceCategorySelectField
                            id={`scan-category-${row.id}`}
                            disabled={locked || save.isPending}
                          />
                        )}
                      </form.AppField>
                      <form.AppField name={`rows[${index}].amount`}>
                        {(field) => (
                          <field.AmountField
                            id={`scan-amount-${row.id}`}
                            showCalculator
                            disabled={locked || save.isPending}
                          />
                        )}
                      </form.AppField>
                    </div>
                    <div className="flex gap-1">
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={t("details")}
                        >
                          <ChevronDown />
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={t("remove")}
                        disabled={locked || save.isPending}
                        onClick={() => form.removeFieldValue("rows", index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    <form.AppField name={`rows[${index}].title`}>
                      {(field) => (
                        <field.TextField
                          id={`scan-title-${row.id}`}
                          label={tc("inputs.title")}
                          disabled={locked || save.isPending}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name={`rows[${index}].notes`}>
                      {(field) => (
                        <field.TextAreaField
                          id={`scan-notes-${row.id}`}
                          label={t("details")}
                          disabled={locked || save.isPending}
                        />
                      )}
                    </form.AppField>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </>
          )}
        </div>
        {scan && !valid && !upload.isPending && (
          <p role="status" className="text-sm text-destructive">
            {t("invalidFields")}
          </p>
        )}
        <DialogFooter>
          <Button
            type="button"
            disabled={!scan || !valid || upload.isPending || save.isPending}
            onClick={() => {
              setError("");
              save.mutate();
            }}
          >
            {locked ? t("retry") : t("saveAll")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
