import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { PageTitle } from "@/app/ui/components/PageTitle";
import ShoppingList from "@/app/ui/pages/ShoppingList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface ShoppingPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { [key: string]: string | string[] | undefined };
}

export default async function ShoppingsList(props: ShoppingPageProps) {
  const queryClient = new QueryClient();

  const groupId = props.params?.groupId as string;

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
