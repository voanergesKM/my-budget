import { useMutation, useQueryClient } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { deleteGroupMember } from "@/app/lib/api/groups/deleteGroupMember";

export function useDeleteGroupMemberMutation(onSuccessCleanup: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      origin,
      groupId,
    }: {
      memberId: string;
      origin: "pending" | "member";
      groupId: string;
    }) => deleteGroupMember(memberId, origin, groupId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.getCurrentGroup] });
      onSuccessCleanup();
      Notify.success(data.message);
    },
  });
}
