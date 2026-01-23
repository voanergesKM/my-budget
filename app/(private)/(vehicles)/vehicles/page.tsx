import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await withServerTranslations("Vehicles");
  return {
    title: buildPageTitle(t("pageTitle")),
    description: t("pageDescription"),
  };
}

export default async function Groups() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: [QueryKeys.groupsList],
  //   queryFn: getUserGroups,
  // });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {/*<GroupsList />*/}
    </HydrationBoundary>
  );
}
