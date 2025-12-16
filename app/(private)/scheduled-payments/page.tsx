import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";
import { getScheduledPayments } from "@/app/lib/api/sheduledPayments/getScheduledPayments";

import ScheduledPayments from "./_components/ScheduledPayments";

type SearchParams = Promise<{
  groupId?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { groupId } = await searchParams;
  const groupName = await getGroupNameById(groupId);

  const t = await withServerTranslations("ScheduledPayments");

  return {
    title: buildPageTitle(t("pageTitle"), groupName),
    description: t("pageDescription"),
  };
}

export default async function ProfilePage(props: {
  searchParams: SearchParams;
}) {
  const queryClient = new QueryClient();
  const { groupId } = await props.searchParams;

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.scheduledPaymentsList(groupId || null)],
    queryFn: () => getScheduledPayments(groupId || null),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ScheduledPayments />
    </HydrationBoundary>
  );
}
