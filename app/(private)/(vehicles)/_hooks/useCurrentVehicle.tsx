import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getVehicleById } from "@/app/lib/api/vehicle/getVehicleById";

export const useCurrentVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: [QueryKeys.vehicleById(vehicleId)],
    queryFn: () => getVehicleById(vehicleId),
  });
};
