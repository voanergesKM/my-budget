"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendCreateCategory } from "@/app/lib/api/categories/sendCreateCategory";
import { sendUpdateCategory } from "@/app/lib/api/categories/sendUpdateCategory";

export function useSendCategoryMutation(
  isEdit: boolean,
  onSuccessCleanup: () => void
) {
  const queryClient = useQueryClient();

  const mutationFn = isEdit ? sendUpdateCategory : sendCreateCategory;

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.categoriesList] });
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
}
