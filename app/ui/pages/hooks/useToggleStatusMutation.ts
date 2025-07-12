import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";

import { toggleShoppingStatus } from "@/app/lib/api/shoppings/toggleStatus";

export function useToggleStatusMutation(
  queryKeys: (string | number)[][],
  onSuccessCleanup?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shoppingId,
      status,
      itemId,
    }: {
      shoppingId: string;
      status: boolean;
      itemId?: string;
    }) => toggleShoppingStatus(shoppingId, status, itemId),

    onSuccess: (data) => {
      queryKeys.forEach((key) => {
        if (key) queryClient.invalidateQueries({ queryKey: key });
      });
      onSuccessCleanup && onSuccessCleanup();
      Notify.success(data.message);
    },

    onError: (error) => {
      Notify.error(error.message);
    },
  });
}
