import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getVehiclesList } from "@/app/lib/api";

export const useVehiclesList = () => {
  return useQuery({
    queryKey: [QueryKeys.vehiclesList()],
    queryFn: () => getVehiclesList(),
  });
};
