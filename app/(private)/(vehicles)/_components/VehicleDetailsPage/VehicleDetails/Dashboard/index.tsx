"use client";

import React from "react";

import ExpensesChart from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/Dashboard/ExpensesChart";
import FuelChart from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/Dashboard/FuelConsumptionChart";
import { Vehicle } from "@/app/lib/types/vehicle";

type Props = {
  vehicleData: Vehicle;
};

export default function VehicleDashboard({ vehicleData }: Props) {
  // Only show fuel charts for vehicles that use fuel
  const hasFuel = vehicleData.type === "car";

  return (
    <div className="grid grid-cols-1 gap-4 pb-10 lg:grid-cols-2 2xl:grid-cols-3">
      <ExpensesChart />
      {hasFuel && (
        <>
          <FuelChart chartType="consumption" />
          <FuelChart chartType="cost" />
          <FuelChart chartType="pricePerLiter" />
          <FuelChart chartType="costPerKm" />
        </>
      )}
    </div>
  );
}
