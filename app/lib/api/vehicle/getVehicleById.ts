import Notify from "@/app/lib/utils/notify";

import { ForbiddenError } from "@/app/lib/errors/customErrors";
import { ApiResponse } from "@/app/lib/types";
import { Vehicle } from "@/app/lib/types/vehicle";

export async function getVehicleById(
  id: string
): Promise<ApiResponse<Vehicle>> {
  const response = await fetch(`/api/vehicles/?vehicleId=${id}`);
  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    if (response.status === 403) {
      throw new ForbiddenError();
    }
    throw new Error(data.message || "Failed to get vehicle");
  }

  return data;
}
