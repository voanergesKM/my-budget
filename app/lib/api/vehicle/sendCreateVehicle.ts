import { ApiResponse } from "@/app/lib/types";
import { Vehicle } from "@/app/lib/types/vehicle";

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
