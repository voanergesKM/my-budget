"use client";

import React from "react";
import { useParams } from "next/navigation";

import VehicleDetails from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails";
import VehicleHeader from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleHeader";
import { useCurrentVehicle } from "@/app/(private)/(vehicles)/_hooks/useCurrentVehicle";

function VehicleDetailsPage() {
  const params = useParams();

  const vehicleId = Array.isArray(params.vehicleId)
    ? params.vehicleId[0]
    : params.vehicleId;

  const { data, isLoading } = useCurrentVehicle(vehicleId || "");

  if (isLoading) return "...loading";

  if (!data) return null;

  const vehicleData = data.data;

  return (
    <div className={"flex flex-col gap-4"}>
      <VehicleHeader vehicleData={vehicleData} />

      <VehicleDetails vehicleData={vehicleData} />
    </div>
  );
}

export default VehicleDetailsPage;
