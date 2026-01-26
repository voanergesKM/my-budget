import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendCreateVehicle } from "@/app/lib/api/vehicle/sendCreateVehicle";
import { sendUpdateVehicle } from "@/app/lib/api/vehicle/sendUpdateVehicle";

import { Vehicle } from "@/app/lib/types/vehicle";

export const useSendVehicleMutation = (vehicleId: string | null) => {
  const queryClient = useQueryClient();

  const mutationFn = ({ payload }: { payload: Partial<Vehicle> }) => {
    return !!vehicleId
      ? sendUpdateVehicle(payload)
      : sendCreateVehicle(payload);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.vehiclesList()],
      });

      if (vehicleId) {
        void queryClient.invalidateQueries({
          queryKey: [QueryKeys.vehicleById(vehicleId)],
        });
      }

      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
};
