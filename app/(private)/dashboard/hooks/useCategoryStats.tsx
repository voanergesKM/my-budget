"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { CategoryStat } from "@/app/lib/definitions";
import { getCurrentMonthRange } from "@/app/lib/utils/getCurrentDateRange";
import QueryKeys from "@/app/lib/utils/queryKeys";

export const useCategoryStats = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const defaultDates = getCurrentMonthRange();

  return useQuery({
    queryKey: [QueryKeys.categorySummary, { groupId, origin, from, to }],
    queryFn: async (): Promise<CategoryStat[]> => {
      const url = new URL("/api/category-stats", window.location.origin);

      if (groupId) url.searchParams.set("groupId", groupId);

      url.searchParams.set("origin", origin ?? "outgoing");

      url.searchParams.set(
        "from",
        from ? new Date(from).toISOString() : defaultDates.from.toISOString()
      );
      url.searchParams.set(
        "to",
        to ? new Date(to).toISOString() : defaultDates.to.toISOString()
      );

      const res = await fetch(url.toString());

      if (!res.ok) throw new Error("Failed to fetch category stats");

      const { data } = await res.json();

      return data;
    },
  });
};
