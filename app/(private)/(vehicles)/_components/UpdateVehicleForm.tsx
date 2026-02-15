"use client";

import React from "react";
import { useParams } from "next/navigation";

import QueryKeys from "@/app/lib/utils/queryKeys";

import AppLoader from "@/app/ui/components/common/AppLoader";

import VehicleForm from "@/app/(private)/(vehicles)/_components/VehicleForm";
import { useCurrentVehicle } from "@/app/(private)/(vehicles)/_hooks/useCurrentVehicle";

function UpdateVehicleForm() {
  const params = useParams();
  const vehicleId = Array.isArray(params.vehicleId)
    ? params.vehicleId[0]
    : params.vehicleId;

  const { data, isLoading } = useCurrentVehicle(vehicleId || "", [
    QueryKeys.vehicleById(vehicleId || ""),
  ]);

  return (
    <div className={"relative flex w-full flex-1 flex-col gap-4"}>
      {!data && isLoading && (
        <AppLoader
          className={
            "static flex flex-1 items-center justify-center rounded-2xl"
          }
          size={100}
        />
      )}
      {data && <VehicleForm vehicleData={data.data} />}
    </div>
  );
}

export default UpdateVehicleForm;
