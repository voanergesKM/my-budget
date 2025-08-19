import { useSearchParams } from "next/navigation";
import { Query, useMutation, useQueryClient } from "@tanstack/react-query";

import { Transaction } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendCreateTransaction } from "@/app/lib/api/transactions/sendCreateTransaction";
import { sendUpdateTransaction } from "@/app/lib/api/transactions/sendUpdateTransaction";

import { useQueryKeys } from "./useQueryKeys";

export const useSendTransactionMutation = (
  isEdit: boolean,
  onSuccessCleanup: () => void
) => {
  const queryClient = useQueryClient();
  const queryKeys = useQueryKeys();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const mutationFn = ({ payload }: { payload: Partial<Transaction> }) => {
    return isEdit
      ? sendUpdateTransaction(payload, groupId)
      : sendCreateTransaction(payload, groupId);
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
      onSuccessCleanup();
      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
};
