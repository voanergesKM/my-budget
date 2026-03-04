import { useQuery } from "@tanstack/react-query";

import { getVehicleById } from "@/app/lib/api";

export const useCurrentVehicle = (
  vehicleId: string,
  queryKey: string[],
  includeStats?: boolean
) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getVehicleById(vehicleId, includeStats),
  });
};
