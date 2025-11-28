"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { SummaryByMonth } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

export const useSummaryByMonth = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  return useQuery({
    queryKey: [QueryKeys.summaryByMonth, { groupId, origin }],
    queryFn: async (): Promise<SummaryByMonth> => {
      const url = new URL(
        "/api/transactions/summary-by-month",
        window.location.origin
      );

      if (groupId) url.searchParams.set("groupId", groupId);

      url.searchParams.set("origin", origin ?? "outgoing");

      const res = await fetch(url.toString());

      if (!res.ok) throw new Error("Failed to fetch category stats");

      const { data } = await res.json();

      return data;
    },
  });
};
