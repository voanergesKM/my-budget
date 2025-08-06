import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupById } from "@/app/lib/api/groups/getGroupById";
import { getTransactionsList } from "@/app/lib/api/transactions/getTransactionsList";

import HomePage from "@/app/ui/components/HomePage";
import Landing from "@/app/ui/components/Landing";

import Layout from "@/app/(private)/layout";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "My Budget",
  description:
    "Control your finances. Plan, track, and manage your budget effortlessly with My Budget.",
};

type SearchParams = Promise<{
  groupId: string;
  origin: "outgoing" | "incoming";
  page: string;
  pageSize: string;
}>;

export default async function Home(props: { searchParams: SearchParams }) {
  const session = await auth();

  if (!session) {
    return <Landing />;
  }

  const queryClient = new QueryClient();
  const { groupId, origin, page, pageSize } = await props.searchParams;

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.getCurrentGroup, groupId ?? "all"],
    queryFn: () => getGroupById(groupId),
  });

  await queryClient.prefetchQuery({
    queryKey: [
      QueryKeys.getTransactionsList,
      groupId ?? "all",
      origin,
      page,
      pageSize,
    ],
    queryFn: () =>
      getTransactionsList(
        groupId,
        origin || "outgoing",
        page ?? "1",
        pageSize ?? "10"
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Layout>
        <HomePage />
      </Layout>
    </HydrationBoundary>
  );
}
