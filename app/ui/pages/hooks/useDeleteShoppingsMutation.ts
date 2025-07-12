import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";

import { deleteShoppings } from "@/app/lib/api/shoppings/deleteShoppings";

export function useDeleteShoppingsMutation(
  queryKey: (string | number)[],
  onSuccessCleanup: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShoppings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccessCleanup();
      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
}
