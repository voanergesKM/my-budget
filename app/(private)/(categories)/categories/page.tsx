import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";

import { PageTitle } from "@/app/ui/components/PageTitle";

import CategoriesList from "../_components/CategoriesList";

type SearchParams = Promise<{
  groupId?: string;
  origin?: "outgoing" | "incoming";
}>;

export default async function Categories(props: {
  searchParams: SearchParams;
}) {
  const queryClient = new QueryClient();

  const { groupId, origin } = await props.searchParams;

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.categoriesList, groupId ?? "all", origin],
    queryFn: () => listAllCategories(origin || "outgoing", groupId || null),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <PageTitle />

      <HydrationBoundary state={dehydratedState}>
        <CategoriesList />
      </HydrationBoundary>
    </>
  );
}
