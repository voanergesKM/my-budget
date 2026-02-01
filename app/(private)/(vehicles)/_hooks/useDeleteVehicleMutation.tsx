import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { deleteVehicle } from "@/app/lib/api/vehicle/deleteVehicle";

export function useDeleteVehicleMutation(onSuccessCleanup: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.vehiclesList()],
      });
      onSuccessCleanup();
      Notify.success(data.message);
    },
  });
}
