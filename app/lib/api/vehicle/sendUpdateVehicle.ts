import { ApiResponse } from "@/app/lib/types";
import { Vehicle } from "@/app/lib/types/vehicle";

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
