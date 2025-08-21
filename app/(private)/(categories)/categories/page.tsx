import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";
import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";

import { PageTitle } from "@/app/ui/components/PageTitle";

import CategoriesList from "../_components/CategoriesList";

type SearchParams = Promise<{
  groupId?: string;
  origin?: "outgoing" | "incoming";
}>;

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { groupId } = await searchParams;
  const groupName = await getGroupNameById(groupId);

  const t = await getTranslations("Categories");

  return {
    title: buildPageTitle(t("pageTitle"), groupName),
    description: t("pageDescription"),
  };
}

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
    <HydrationBoundary state={dehydratedState}>
      <CategoriesList />
    </HydrationBoundary>
  );
}
