import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { CategoryStat } from "@/app/lib/definitions";
import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import { getCurrentMonthRange } from "@/app/lib/utils/getCurrentDateRange";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";

import Dashboard from "./_components";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { groupId } = await searchParams;
  const groupName = await getGroupNameById(groupId);

  return {
    title: buildPageTitle("Dashboard", groupName),
    description: "Your personal budgeting dashboard and analytics.",
  };
}

export default async function DashboardPage({ searchParams }: Props) {
  const { groupId, origin } = await searchParams;

  const queryClient = new QueryClient();

  const defaultDates = getCurrentMonthRange();

  await queryClient.prefetchQuery({
    queryKey: [
      QueryKeys.categorySummary,
      { groupId, origin, from: defaultDates.from, to: defaultDates.to },
    ],
    queryFn: async (): Promise<CategoryStat[]> => {
      const url = new URL("/api/category-stats", window.location.origin);

      if (groupId) url.searchParams.set("groupId", groupId);
      if (origin) url.searchParams.set("origin", origin);
      url.searchParams.set("from", defaultDates.from.toISOString());
      url.searchParams.set("to", defaultDates.to.toISOString());

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch category stats");

      const { data } = await res.json();

      return data;
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <Dashboard />
      </HydrationBoundary>
    </>
  );
}
