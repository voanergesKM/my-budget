import Notify from "@/app/lib/utils/notify";

import { FuelRecordType } from "@/app/lib/types/vehicle";

export async function sendCreateRecord({
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
