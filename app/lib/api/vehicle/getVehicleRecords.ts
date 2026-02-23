import { ApiResponse } from "@/app/lib/types";
import {
  FuelRecordType,
  ScheduleRecordType,
  ServiceRecordType,
} from "@/app/lib/types/vehicle";

import { PaginatedResponse } from "../../definitions";

type ResponseRecordType =
  | FuelRecordType
  | ServiceRecordType
  | ScheduleRecordType;

export const getVehicleRecords = async (
  type: "fuel" | "service" | "schedule",
  vehicleId: string,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<ResponseRecordType>>> => {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());
  params.set("vehicleId", vehicleId);

  const response = await fetch(
    `/api/vehicles/${type}-records?${params.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `Failed to fetch fuel records (${response.status}): ${errorText}`
    );
  }

  return response.json();
};
