import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Transaction } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendCreateTransaction } from "@/app/lib/api/transactions/sendCreateTransaction";
import { sendUpdateTransaction } from "@/app/lib/api/transactions/sendUpdateTransaction";

import { useQueryKeys } from "./useQueryKeys";

export const useSendTransactionMutation = (isEdit: boolean) => {
  const queryClient = useQueryClient();
  const queryKeys = useQueryKeys();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const mutationFn = ({
    payload,
  }: {
    payload: Partial<Transaction> | Partial<Transaction>[];
  }) => {
    return isEdit
      ? sendUpdateTransaction(payload as Partial<Transaction>, groupId)
      : sendCreateTransaction(payload as Partial<Transaction>[], groupId);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys,
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.categorySummary],
      });
      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
};
