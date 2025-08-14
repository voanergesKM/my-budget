import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";

import { deleteGroup } from "@/app/lib/api/groups/deleteGroup";

export function useDeleteGroupMutation(
  queryKey: (string | number)[],
  onSuccessCleanup: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccessCleanup();
      Notify.success(data.message);
    },
  });
}
