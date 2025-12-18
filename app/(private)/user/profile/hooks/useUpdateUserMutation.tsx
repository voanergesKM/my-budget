import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PublicUser } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { updateUser } from "@/app/lib/api/user/updateUser";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  const mutationFn = ({ payload }: { payload: PublicUser }) => {
    return updateUser(payload);
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.getCurrentUser],
      });

      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
};
