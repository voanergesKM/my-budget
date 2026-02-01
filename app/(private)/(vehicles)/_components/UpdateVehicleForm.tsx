"use client";

import React from "react";
import { useParams } from "next/navigation";

import VehicleForm from "@/app/(private)/(vehicles)/_components/VehicleForm";
import { useCurrentVehicle } from "@/app/(private)/(vehicles)/_hooks/useCurrentVehicle";

function UpdateVehicleForm() {
  const params = useParams();
  const vehicleId = Array.isArray(params.vehicleId)
    ? params.vehicleId[0]
    : params.vehicleId;

  const { data } = useCurrentVehicle(vehicleId || "");

  return <div>{data && <VehicleForm vehicleData={data.data} />}</div>;
}

export default UpdateVehicleForm;
