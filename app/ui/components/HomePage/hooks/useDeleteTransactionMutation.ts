"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { deleteTransations } from "@/app/lib/api/transactions/deleteTransaction";

import { useQueryKeys } from "./useQueryKeys";

export function useDeleteTransactionMutation(onSuccessCleanup: () => void) {
  const queryClient = useQueryClient();

  const t = useTranslations("Notifications");
  const te = useTranslations("Entities");

  const queryKeys = useQueryKeys();

  return useMutation({
    mutationFn: deleteTransations,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.categorySummary],
      });
      onSuccessCleanup();

      const message = t("deleted", {
        entity: te("transaction.accusative"),
        name: "",
      });

      Notify.success(message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
}
