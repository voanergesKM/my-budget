import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { deleteGroup } from "@/app/lib/api/groups/deleteGroup";

export function useDeleteVehicleMutation(onSuccessCleanup: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.vehiclesList()],
      });
      onSuccessCleanup();
      Notify.success(data.message);
    },
  });
}
