import { serverFetch } from "@/app/lib/utils/serverFetch";

export async function getVehicleNameById(vehicleId: string) {
  try {
    const res = await serverFetch<{ success: boolean; data: any }>(
      "/api/vehicles?vehicleId=" + vehicleId
    );
    return res.data?.name ?? undefined;
  } catch {
    return undefined;
  }
}
