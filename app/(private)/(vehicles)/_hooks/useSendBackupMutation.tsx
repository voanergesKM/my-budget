import { useMutation, useQueryClient } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { sendBackup } from "@/app/lib/api/vehicle/sendBackup";

export const useSendBackupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendBackup,
    onSuccess: ({ data }) => {
      const { vehicleId, importedSectionsNames, group } = data;

      importedSectionsNames.forEach((sectionName: string) => {
        if (sectionName === "fuel") {
          void queryClient.invalidateQueries({
            queryKey: QueryKeys.vehicleFuelRecords(
              vehicleId,
              undefined,
              undefined
            ),
          });

          // invalidate transactions list
          // queryClient.invalidateQueries({
          //   queryKey: [
          //     QueryKeys.getTransactionsList,
          //     group ?? "all",
          //     "outgoing",
          //     1,
          //     10,
          //   ],
          // });
        }
      });
    },
  });
};
