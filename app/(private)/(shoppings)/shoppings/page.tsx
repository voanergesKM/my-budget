import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";
import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";

import ShoppingList from "../_components/ShoppingList";

type SearchParams = Promise<{
  page?: string;
  pageSize?: string;
  groupId?: string;
}>;

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { groupId } = await searchParams;
  const groupName = await getGroupNameById(groupId);

  const t = await getTranslations("Shoppings");

  return {
    title: buildPageTitle(t("pageTitle"), groupName),
    description: t("pageDescription"),
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
    <HydrationBoundary state={dehydratedState}>
      <ShoppingList />
    </HydrationBoundary>
  );
}
