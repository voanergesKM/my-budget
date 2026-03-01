import { PaginatedResponse } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";

import { ApiResponse } from "@/app/lib/types";
import {
  FuelRecordType,
  ScheduleRecordType,
  ServiceRecordType,
} from "@/app/lib/types/vehicle";

export async function deleteRecord({
  deletedRecords,
  type,
  vehicleId,
}: {
  deletedRecords: { recordId: string; transactionId: string | null }[];
  type: "fuel" | "service" | "dashboard" | "schedule";
  vehicleId: string;
}) {
  const url = `/api/vehicles/${type}-records`;

  const response = await fetch(`${url}`, {
    method: "DELETE",
    body: JSON.stringify({ deletedRecords, vehicleId }),
  });

  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    throw new Error(data.message || "Failed to delete record");
  }

  return data;
}

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

export async function sendUpdateRecord({
  record,
  type,
  vehicleId,
}: {
  record:
    | Partial<FuelRecordType | ServiceRecordType>
    | Partial<ScheduleRecordType>;
  type: "fuel" | "service" | "schedule";
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
