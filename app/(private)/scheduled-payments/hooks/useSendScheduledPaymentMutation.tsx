import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendCreateScheduledPayment } from "@/app/lib/api/sheduledPayments/sendCreateScheduledPayment";
import { sendUpdateScheduledPayment } from "@/app/lib/api/sheduledPayments/sendUpdateScheduledPayment";

import { useSearchParamsFilters } from "@/app/lib/hooks/useSearchParamsFilters";

import { ScheduledPaymentType } from "@/app/lib/types";

export const useSendScheduledPaymentMutation = (isEdit: boolean) => {
  const queryClient = useQueryClient();

  const { groupId, currentPage, pageSize } = useSearchParamsFilters();

  const mutationFn = ({ payload }: { payload: ScheduledPaymentType }) => {
    return isEdit
      ? sendUpdateScheduledPayment(payload)
      : sendCreateScheduledPayment(payload, groupId);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.scheduledPaymentsList(groupId, currentPage, pageSize),
        ],
      });

      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
};
