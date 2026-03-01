import Notify from "@/app/lib/utils/notify";
import { serverFetch } from "@/app/lib/utils/serverFetch";

import { ForbiddenError } from "@/app/lib/errors/customErrors";
import { ApiResponse } from "@/app/lib/types";
import { ScheduleRecordType, Vehicle } from "@/app/lib/types/vehicle";

export const deleteVehicle = async (
  vehicleId: string
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch("/api/vehicles", {
    method: "DELETE",
    body: JSON.stringify({ vehicleId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export async function getVehicleById(
  id: string,
  includeStats?: boolean
): Promise<ApiResponse<Vehicle>> {
  const searchParams = new URLSearchParams();

  searchParams.set("vehicleId", id);

  if (includeStats) {
    searchParams.set("includeStats", "true");
  }

  const response = await fetch(`/api/vehicles/?${searchParams.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    if (response.status === 403) {
      throw new ForbiddenError();
    }
    throw new Error(data.message || "Failed to get vehicle");
  }

  return { ...data };
}

export async function getVehicleNameById(vehicleId: string) {
  try {
    const res = await serverFetch<{ success: boolean; data: any }>(
      "/api/vehicles?vehicleId=" + vehicleId
    );
    return res.data?.name ?? undefined;
  } catch {
    return undefined;
  }
}

export async function getVehicleReminds({
  vehicleId,
}: {
  vehicleId: string;
}): Promise<ApiResponse<ScheduleRecordType[]>> {
  const url = `/api/vehicles/${vehicleId}/reminders`;

  const response = await fetch(`${url}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    throw new Error(data.message || "Failed to get statuses");
  }

  return data;
}

export const getVehiclesList = async (): Promise<ApiResponse<Vehicle[]>> => {
  const response = await fetch(`/api/vehicles`);

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const sendCreateVehicle = async (
  payload: Partial<Vehicle>
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch("/api/vehicles", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const sendUpdateVehicle = async (
  payload: Partial<Vehicle>
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch("/api/vehicles", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update vehicle");
  }

  return data;
};
