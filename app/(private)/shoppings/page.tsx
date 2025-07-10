import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { PageTitle } from "@/app/ui/components/PageTitle";
import ShoppingList from "@/app/ui/pages/ShoppingList";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const dynamic = "force-static";

type PageProps = {
  params: { groupId: string };
  searchParams: { page?: string; pageSize?: string };
};

export default async function ShoppingsList({
  params,
  searchParams,
}: PageProps) {
  const queryClient = new QueryClient();
  const { groupId } = params;
  const { page, pageSize } = searchParams;

  const currentPage = Number(page || 1);
  const rowsPerPage = Number(pageSize || 10);

  await queryClient.prefetchQuery({
    queryKey: ["shoppingList", groupId ?? "all", currentPage, rowsPerPage],
    queryFn: () => getShoppingsList(groupId, currentPage, rowsPerPage),
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
