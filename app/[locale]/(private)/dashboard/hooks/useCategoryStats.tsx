import { useQuery } from "@tanstack/react-query";

import { CategoryStat } from "@/app/lib/definitions";
import { getCurrentMonthRange } from "@/app/lib/utils/getCurrentDateRange";
import QueryKeys from "@/app/lib/utils/queryKeys";

type UseCategoryStatsParams = {
  groupId?: string;
  origin?: string;
  from?: Date;
  to?: Date;
};

export const useCategoryStats = ({
  groupId,
  origin = "outgoing",
  from,
  to,
}: UseCategoryStatsParams) => {
  const defaultDates = getCurrentMonthRange();

  const fromParam = from ?? defaultDates.from;
  const toParam = to ?? defaultDates.to;

  return useQuery({
    queryKey: [
      QueryKeys.categorySummary,
      { groupId, origin, from: fromParam, to: toParam },
    ],
    queryFn: async (): Promise<CategoryStat[]> => {
      const url = new URL("/api/category-stats", window.location.origin);

      if (groupId) url.searchParams.set("groupId", groupId);
      if (origin) url.searchParams.set("origin", origin);

      if (fromParam) url.searchParams.set("from", fromParam.toISOString());
      if (toParam) url.searchParams.set("to", toParam.toISOString());

      const res = await fetch(url.toString());

      if (!res.ok) throw new Error("Failed to fetch category stats");

      const { data } = await res.json();

      return data;
    },
  });
};
