import Notify from "@/app/lib/utils/notify";

export async function getVehicleReminds({ vehicleId }: { vehicleId: string }) {
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
