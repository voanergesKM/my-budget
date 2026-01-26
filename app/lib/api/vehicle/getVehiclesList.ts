import { ApiResponse } from "@/app/lib/types";
import { Vehicle } from "@/app/lib/types/vehicle";

export const getVehiclesList = async (): Promise<ApiResponse<Vehicle[]>> => {
  const response = await fetch(`/api/vehicles`);

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
