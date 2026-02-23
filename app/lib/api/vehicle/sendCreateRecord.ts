import Notify from "@/app/lib/utils/notify";

import {
  FuelRecordType,
  ScheduleRecordType,
  ServiceRecordType,
} from "@/app/lib/types/vehicle";

export async function sendCreateRecord({
  record,
  type,
  vehicleId,
}: {
  record:
    | Partial<FuelRecordType>
    | Partial<ServiceRecordType>
    | Partial<ScheduleRecordType>;
  type: "fuel" | "service" | "schedule";
  vehicleId: string;
}) {
  const url = `/api/vehicles/${type}-records`;

  const response = await fetch(`${url}`, {
    method: "POST",
    body: JSON.stringify({ record, vehicleId, type }),
  });

  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    throw new Error(data.message || "Failed to create record");
  }

  return data;
}
