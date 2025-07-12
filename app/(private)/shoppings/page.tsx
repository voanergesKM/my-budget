import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";

import { PageTitle } from "@/app/ui/components/PageTitle";

import ShoppingList from "@/app/ui/pages/Shoppings/ShoppingList";

type Params = Promise<{ groupId: string }>;
type SearchParams = Promise<{ page?: string; pageSize?: string }>;

export default async function ShoppingsList(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { params, searchParams } = props;
  const queryClient = new QueryClient();
  const { groupId } = await params;
  const { page, pageSize } = await searchParams;

  const currentPage = Number(page || 1);
  const rowsPerPage = Number(pageSize || 10);

  await queryClient.prefetchQuery({
    queryKey: [
      ...QueryKeys.shoppingList,
      groupId ?? "all",
      currentPage,
      rowsPerPage,
    ],
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
