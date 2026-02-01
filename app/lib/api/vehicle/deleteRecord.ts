import Notify from "@/app/lib/utils/notify";

export async function deleteRecord({
  deletedRecords,
  type,
  vehicleId,
}: {
  deletedRecords: { recordId: string; transactionId: string | null }[];
  type: "fuel" | "service" | "dashboard";
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
