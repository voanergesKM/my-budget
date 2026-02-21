import { PublicUser, Transaction } from "@/app/lib/definitions";

import { SERVICE_CATEGORIES } from "@/app/lib/constants";

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

export type VehicleFormValues = {
  name: string;
  description: string;
  imageSrc: string;
  group?: string | null;
  category?: string | null;
  type: VehicleTypeEnum;

  fuelType?: FuelTypeEnum;
  odometer?: number;
  vinCode?: string;
};

export type Vehicle = {
  _id: string;
  createdBy: string;
  currentOdometer: number;
  createdAt: Date;
  updatedAt: Date;
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

export type StatsValue = number | string | boolean | Date | null;

export type StatsBlock = Record<string, StatsValue>;

export type FuelStats = Record<string, StatsBlock | null>;

export type VehicleStats = Partial<{
  fuel: FuelStats;
}>;
