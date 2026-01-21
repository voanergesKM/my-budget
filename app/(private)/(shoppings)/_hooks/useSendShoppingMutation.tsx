import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Shopping } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { createShopping } from "@/app/lib/api/shoppings/createShopping";
import { updateShopping } from "@/app/lib/api/shoppings/updateShopping";

export const useSendShoppingMutation = (
  isEdit: boolean,
  initialData?: Shopping
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const shoppingListKey = [QueryKeys.shoppingList, groupId ?? "all"];

  const mutationFn = ({ payload }: { payload: Partial<Shopping> }) => {
    return isEdit
      ? updateShopping({ ...payload })
      : createShopping({ ...payload, groupId });
  };

  return useMutation({
    mutationFn,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: shoppingListKey });

      if (isEdit && !!initialData) {
        const shoppingId = initialData._id;

        queryClient.setQueryData(
          [QueryKeys.getCurrentShopping, shoppingId ?? "all"],
          {
            success: true,
            data: data.data,
            message: data.message,
          }
        );
      }

      Notify.success(data.message);

      if (!isEdit) {
        router.back();
      }
    },
    onError: (error) => {
      Notify.error(error.message);
    },
  });
};
