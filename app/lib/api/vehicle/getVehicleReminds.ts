import Notify from "@/app/lib/utils/notify";

import { ApiResponse } from "@/app/lib/types";
import { ScheduleRecordType } from "@/app/lib/types/vehicle";

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
