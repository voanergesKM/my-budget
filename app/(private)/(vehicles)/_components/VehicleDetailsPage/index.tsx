"use client";

import React from "react";
import { useParams } from "next/navigation";

import QueryKeys from "@/app/lib/utils/queryKeys";

import AppLoader from "@/app/ui/components/common/AppLoader";

import Reminder from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/Reminder";
import VehicleDetails from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails";
import VehicleHeader from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleHeader";
import { useCurrentVehicle } from "@/app/(private)/(vehicles)/_hooks/useCurrentVehicle";
import { useVehicleRemindersList } from "@/app/(private)/(vehicles)/_hooks/useVehicleRemindersList";

import { VehicleUnitsProvider } from "./VehicleUnitsContext";

function VehicleDetailsPage() {
  const params = useParams();

  const vehicleId = Array.isArray(params.vehicleId)
    ? params.vehicleId[0]
    : params.vehicleId;

  const { data, isLoading } = useCurrentVehicle(
    vehicleId || "",
    [QueryKeys.currentVehicle(vehicleId || "")],
    true
  );

  const { data: reminders } = useVehicleRemindersList();

  return (
    <div className={"relative flex flex-1 flex-col gap-4"}>
      {!data && isLoading && (
        <AppLoader
          className={
            "static flex flex-1 items-center justify-center rounded-2xl"
          }
          size={100}
        />
      )}

      {data && data.data && (
        <VehicleUnitsProvider
          value={{
            distanceUnit: data.data.distanceUnit ?? "km",
            fuelUnit: data.data.fuelUnit ?? "l",
            showMetricUnits: data.data.showMetricUnits ?? false,
          }}
        >
          <VehicleHeader vehicleData={data.data} />

          <VehicleDetails vehicleData={data.data} />
        </VehicleUnitsProvider>
      )}

      {data?.data && reminders && reminders.length > 0 && (
        <VehicleUnitsProvider
          value={{
            distanceUnit: data.data.distanceUnit ?? "km",
            fuelUnit: data.data.fuelUnit ?? "l",
            showMetricUnits: data.data.showMetricUnits ?? false,
          }}
        >
          <Reminder data={reminders} />
        </VehicleUnitsProvider>
      )}
    </div>
  );
}

export default VehicleDetailsPage;
