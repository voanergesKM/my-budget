import { ApiResponse } from "@/app/lib/types";
import { Vehicle } from "@/app/lib/types/vehicle";

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
