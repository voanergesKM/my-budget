import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getVehicleReminds } from "@/app/lib/api/vehicle/getVehicleReminds";

export function useVehicleRemindersList() {
  const queryClient = useQueryClient();
  const params = useParams();

  const { vehicleId } = params;

  return useQuery({
    queryFn: async () => {
      const response = await getVehicleReminds({
        vehicleId: vehicleId as string,
      });

      void queryClient.invalidateQueries({
        queryKey: QueryKeys.vehicleScheduleRecords(vehicleId as string),
      });

      return response;
    },
    queryKey: QueryKeys.vehicleReminders(vehicleId as string),
  });
}
