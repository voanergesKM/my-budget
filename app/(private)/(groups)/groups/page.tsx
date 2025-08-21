import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import GroupsList from "../_components/GroupsList";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const t = await withServerTranslations("Groups");
  return {
    title: buildPageTitle(t("pageTitle")),
    description: t("pageDescription"),
  };
}

export default async function Groups() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.groupsList],
    queryFn: getUserGroups,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <GroupsList />
    </HydrationBoundary>
  );
}
