"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { deleteScheduledPayment } from "@/app/lib/api/sheduledPayments/deleteScheduledPayment";

import { useSearchParamsFilters } from "@/app/lib/hooks/useSearchParamsFilters";

export function useDeleteScheduledPaymentMutation(
  onSuccessCleanup: () => void
) {
  const queryClient = useQueryClient();

  const { groupId, currentPage, pageSize } = useSearchParamsFilters();

  const t = useTranslations("Notifications");
  const te = useTranslations("Entities");

  return useMutation({
    mutationFn: deleteScheduledPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.scheduledPaymentsList(groupId, currentPage, pageSize),
        ],
      });

      onSuccessCleanup();

      const message = t("deleted", {
        entity: te("scheduledPayment.accusative"),
        name: "",
      });

      Notify.success(message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
}
