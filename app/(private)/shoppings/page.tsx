import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { PageTitle } from "@/app/ui/components/PageTitle";
import ShoppingList from "@/app/ui/pages/ShoppingList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function ShoppingsList({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { groupId } = await params;

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
