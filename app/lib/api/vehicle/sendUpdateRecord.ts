import Notify from "@/app/lib/utils/notify";

import { FuelRecordType } from "@/app/lib/types/vehicle";

export async function sendUpdateRecord({
  record,
  type,
  vehicleId,
}: {
  record: Partial<FuelRecordType>;
  type: "fuel" | "service";
  vehicleId: string;
}) {
  const url = `/api/vehicles/${type}-records`;

  const response = await fetch(`${url}`, {
    method: "PATCH",
    body: JSON.stringify({ record, vehicleId, type }),
  });

  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    throw new Error(data.message || "Failed to update record");
  }

  return data;
}
