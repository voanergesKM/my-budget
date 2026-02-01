import { ApiResponse } from "@/app/lib/types";
import { FuelRecordType } from "@/app/lib/types/vehicle";

import { PaginatedResponse } from "../../definitions";

export const getVehicleFuelRecords = async (
  vehicleId: string,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<FuelRecordType>>> => {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());
  params.set("vehicleId", vehicleId);

  const response = await fetch(
    `/api/vehicles/fuel-records?${params.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `Failed to fetch fuel records (${response.status}): ${errorText}`
    );
  }

  return response.json();
};
