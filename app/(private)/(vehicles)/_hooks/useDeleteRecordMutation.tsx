import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { deleteRecord } from "@/app/lib/api/vehicle/deleteRecord";

export function useDeleteRecordMutation(
  vehicleId: string,
  type: string,
  onSuccessCleanup: () => void
) {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  return useMutation({
    mutationFn: deleteRecord,
    onSuccess: (data) => {
      if (type === "fuel") {
        void queryClient.invalidateQueries({
          queryKey: QueryKeys.vehicleFuelRecords(
            vehicleId,
            page || undefined,
            pageSize || undefined
          ),
        });
      }

      if (type === "service") {
        void queryClient.invalidateQueries({
          queryKey: QueryKeys.vehicleServiceRecords(
            vehicleId,
            page || undefined,
            pageSize || undefined
          ),
        });
      }

      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.currentVehicle(vehicleId)],
      });

      onSuccessCleanup();

      Notify.success(data.message);
    },
  });
}
