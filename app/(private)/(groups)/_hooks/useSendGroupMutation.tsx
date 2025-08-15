"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Group } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { createGroup } from "@/app/lib/api/groups/createGroup";
import { updateGroup } from "@/app/lib/api/groups/updateGroup";

export function useCreateGroupMutation(onSuccessCleanup: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.groupsList] });
      onSuccessCleanup();
      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
}

export function useUpdateGroupMutation(onSuccessCleanup: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<Group, "_id">;
    }) => updateGroup(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.groupsList] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.getCurrentGroup] });

      onSuccessCleanup();
      Notify.success(data.message);
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
}
