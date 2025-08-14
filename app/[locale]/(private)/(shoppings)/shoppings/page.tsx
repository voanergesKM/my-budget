import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";
import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";

import { PageTitle } from "@/app/ui/components/PageTitle";

import ShoppingList from "../_components/ShoppingList";

type SearchParams = Promise<{
  page?: string;
  pageSize?: string;
  groupId?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { groupId } = await searchParams;
  const groupName = await getGroupNameById(groupId);

  return {
    title: buildPageTitle("Shoppings list", groupName),
    description: "Shoppings list.",
  };
}

export default async function ShoppingsList(props: {
  searchParams: SearchParams;
}) {
  const { searchParams } = props;
  const queryClient = new QueryClient();
  const { groupId } = await searchParams;
  const { page, pageSize } = await searchParams;

  const currentPage = Number(page || 1);
  const rowsPerPage = Number(pageSize || 10);

  await queryClient.prefetchQuery({
    queryKey: [
      QueryKeys.shoppingList,
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
