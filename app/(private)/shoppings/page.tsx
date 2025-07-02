import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { PageTitle } from "@/app/ui/components/PageTitle";
import ShoppingList from "@/app/ui/pages/ShoppingList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function ShoppingsList({ params }: { params: { groupId: string } }) {
  const queryClient = new QueryClient();
  const groupId = params.groupId;

  await queryClient.prefetchQuery({
    queryKey: ["shoppingList", groupId ?? "all"],
    queryFn: () => getShoppingsList(groupId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <PageTitle />
      <HydrationBoundary state={dehydratedState}>
        <ShoppingList />
      </HydrationBoundary>
    </>
  );
}
