import { useMutation } from "@tanstack/react-query";

import { sendParseVehicleBackup } from "@/app/lib/api";

export const useParseVehicleBackupMutation = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: sendParseVehicleBackup,
    onSuccess: (data) => {
      onSuccess();
    },
  });
};
