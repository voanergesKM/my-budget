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
} & VehicleFormValues;
