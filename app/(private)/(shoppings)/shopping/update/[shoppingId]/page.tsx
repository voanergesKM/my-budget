import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import getShoppingById from "@/app/lib/api/shoppings/getShoppingById";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

import UpdateShopping from "../../../_components/UpdateShopping";

type Params = Promise<{ shoppingId: string }>;

export default async function ShoppingCreate(props: { params: Params }) {
  const queryClient = new QueryClient();
  const { shoppingId } = await props.params;

  try {
    await queryClient.prefetchQuery({
      queryKey: [...QueryKeys.getCurrentShopping, shoppingId ?? "all"],
      queryFn: () => getShoppingById(shoppingId),
    });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      redirect("/forbidden");
    }
    throw error;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <UpdateShopping />
      </HydrationBoundary>
    </div>
  );
}
