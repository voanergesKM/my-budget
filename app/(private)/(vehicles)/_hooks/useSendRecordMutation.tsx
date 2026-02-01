import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendCreateRecord } from "@/app/lib/api/vehicle/sendCreateRecord";
import { sendUpdateRecord } from "@/app/lib/api/vehicle/sendUpdateRecord";

export function useSendRecordMutation(
  vehicleId: string,
  isEdit: boolean,
  type: string
) {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const mutationFn = isEdit ? sendUpdateRecord : sendCreateRecord;

  return useMutation({
    mutationFn: mutationFn,
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

      Notify.success(data.message);
    },
  });
}
