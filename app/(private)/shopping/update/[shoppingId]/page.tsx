import getShoppingById from "@/app/lib/api/shoppings/getShoppingById";
import { ForbiddenError } from "@/app/lib/errors/customErrors";
import UpdateShopping from "@/app/ui/pages/UpdateShopping";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

type PageProps = {
  params: { shoppingId: string };
};

export default async function ShoppingCreate({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { shoppingId } = params;

  try {
    await queryClient.prefetchQuery({
      queryKey: ["getShopping", shoppingId ?? "all"],
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
