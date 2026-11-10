import { PublicUser, Transaction } from "@/app/lib/definitions";

import {
  SERVICE_CATEGORIES,
  VEHICLE_REMIND_STATUS,
  VEHICLE_TRANSACTION_TYPES,
} from "@/app/lib/constants";
import type { DistanceUnit, FuelUnit } from "@/app/lib/vehicle/units";

export const fuelTypes = [
  "petrol",
  "diesel",
  "gas",
  "electric",
  "hybrid",
] as const;
export const vehicleTypes = ["car", "bicycle"] as const;

export type FuelTypeEnum = (typeof fuelTypes)[number];
export type VehicleTypeEnum = (typeof vehicleTypes)[number];

type ReminderSettings = {
  default: {
    dateGapDays: number;
    odometerGapKm: number;
  };
};

export type VehicleFormValues = {
  name: string;
  description: string;
  imageSrc: string;
  group?: string | null;
  category?: string | null;
  transactionCategories?: Partial<
    Record<(typeof VEHICLE_TRANSACTION_TYPES)[number], string | null>
  >;
  type: VehicleTypeEnum;

  fuelType?: FuelTypeEnum;
  distanceUnit?: DistanceUnit;
  fuelUnit?: FuelUnit;
  showMetricUnits?: boolean;
  odometer?: number;
  vinCode?: string;

  reminderSettings: ReminderSettings;
};

export type Vehicle = {
  _id: string;
  createdBy: string;
  currentOdometer: number;
  createdAt: Date;
  updatedAt: Date;
  hasHistory?: boolean;
  stats?: VehicleStats;
} & VehicleFormValues;

export type FuelRecordType = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: PublicUser;
  vehicle: string | Vehicle;
  odometer: number;
  liters: number;
  amount: number;
  fullTank: boolean;
  isMissed: boolean;
  station: string;
  notes: string;
  city: string;
  transaction: string | Transaction;
  currency: string;
  trip: number;
  consumption: number;
};

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type VehicleRemindStatus = (typeof VEHICLE_REMIND_STATUS)[number];

export type ServiceRecordType = {
  _id: string;
  createdAt: string;
  updatedAt?: string;

  createdBy: PublicUser;
  vehicle?: string | Vehicle;
  transaction?: string | Transaction;

  currency: string;

  title: string;
  category: ServiceCategory;
  amount: number;
  odometer?: number;
  notes?: string;

  imported?: string;
};

export type ScheduleRecordType = {
  _id: string;
  createdAt: string;
  completedAt: string;
  updatedAt?: string;
  createdBy: PublicUser;
  vehicle?: string | Vehicle;

  record: string | ServiceRecordType;

  title: string;
  category: ServiceCategory;
  triggerDate: string | null;
  triggerOdometer: number | null;
  status: VehicleRemindStatus;

  imported?: string;

  repeat?: boolean;
  month?: number | null;
  nextOdometer?: number | null;
};

export type StatsValue = number | string | boolean | Date | null;

export type StatsBlock = Record<string, StatsValue>;

export type Stats = Record<string, StatsBlock | null>;

export type VehicleStats = Partial<{
  fuel: Stats;
  expenses: Stats;
  fuelHistory: FuelHistoryStats;
}>;

export type FuelHistoryPeriod = "last" | "3" | "6" | "12" | "all";
export type FuelHistoryMetric =
  "consumption" | "kmPerLiter" | "pricePerLiter" | "refuelCost" | "costPerKm";
export type FuelHistoryValue = {
  min: number | null;
  avg: number | null;
  max: number | null;
  count: number;
  total: number;
  lastAt: string | null;
  currency: string | null;
};
export type FuelHistoryStats = Record<
  FuelHistoryPeriod,
  Record<FuelHistoryMetric, FuelHistoryValue>
>;
