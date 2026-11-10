"use client";

import { createContext, useContext } from "react";

import type { DistanceUnit, FuelUnit } from "@/app/lib/vehicle/units";

export type VehicleUnits = {
  distanceUnit: DistanceUnit;
  fuelUnit: FuelUnit;
  showMetricUnits: boolean;
};

const VehicleUnitsContext = createContext<VehicleUnits>({
  distanceUnit: "km",
  fuelUnit: "l",
  showMetricUnits: false,
});

export const VehicleUnitsProvider = VehicleUnitsContext.Provider;
export const useVehicleUnits = () => useContext(VehicleUnitsContext);
