import { useTranslations } from "next-intl";

import FuelRecordForm from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog/FuelRecordForm";
import ScheduleRecordForm from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog/ScheduleRecordForm";
import ServiceRecordForm from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog/ServiceRecordForm";
import {
  createFuelRecordSchema,
  createScheduleRecordSchema,
  createServiceRecordSchema,
} from "@/app/lib/schema/vehicleRecord.schema";
import {
  FuelRecordType,
  ScheduleRecordType,
  ServiceRecordType,
} from "@/app/lib/types/vehicle";

export function getDialogTitle(
  t: ReturnType<typeof useTranslations>,
  type: "fuel" | "service" | "schedule",
  isEdit: boolean
) {
  switch (type) {
    case "fuel":
      return t("fuelRecordDialogTitle", { isEdit: isEdit.toString() });

    case "service":
      return t("serviceRecordDialogTitle", { isEdit: isEdit.toString() });

    case "schedule":
      return t("scheduleRecordDialogTitle", { isEdit: isEdit.toString() });
  }
}

export function mapFuelRecordToForm(recordData: FuelRecordType) {
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
    currency: recordData.currency,
  };
}

export function getDefaultFuelFormValues(vehicleOdometer: number) {
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

export function getDefaultServiceFormValues(vehicleOdometer: number) {
  return {
    title: "",
    createdAt: new Date().toISOString(),
    odometer: vehicleOdometer,
    category: "",
    notes: "",
    amount: 0,

    remind: false,
    reminderMode: "relative",

    remindAtDate: "",
    remindAtOdometer: 0,
    month: 0,
    trip: 0,
  };
}

export function mapServiceRecordToForm(recordData: ServiceRecordType) {
  return {
    _id: recordData._id,
    createdAt: recordData.createdAt,
    title: recordData.title,
    odometer: recordData.odometer,
    category: recordData.category,
    notes: recordData.notes,
    amount: recordData.amount,
    transaction: recordData.transaction,
    currency: recordData.currency,

    remind: false,
    reminderMode: "relative",
    remindAtDate: "",
    remindAtOdometer: 0,
    month: 0,
    trip: 0,
  };
}

export function getDefaultScheduleFormValues() {
  return {
    title: "",
    category: "",
    triggerDate: "",
    triggerOdometer: 0,
    status: "scheduled",
  };
}

export function mapScheduleRecordToForm(recordData: ScheduleRecordType) {
  return {
    _id: recordData._id,
    createdAt: recordData.createdAt,

    title: recordData.title,
    category: recordData.category,
    triggerDate: recordData.triggerDate || "",
    triggerOdometer: recordData.triggerOdometer,
    status: recordData.status,
  };
}

export const recordConfig = {
  fuel: {
    createSchema: createFuelRecordSchema,
    getDefaultValues: getDefaultFuelFormValues,
    getFormValues: mapFuelRecordToForm,
    FormComponent: FuelRecordForm,
  },
  service: {
    createSchema: createServiceRecordSchema,
    getDefaultValues: getDefaultServiceFormValues,
    getFormValues: mapServiceRecordToForm,
    FormComponent: ServiceRecordForm,
  },
  schedule: {
    createSchema: createScheduleRecordSchema,
    getDefaultValues: getDefaultScheduleFormValues,
    getFormValues: mapScheduleRecordToForm,
    FormComponent: ScheduleRecordForm,
  },
};
