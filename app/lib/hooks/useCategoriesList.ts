import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { listAllCategories } from "@/app/lib/api/categories/listAllCategories";

export const useCategoriesList = () => {
  const searchParams = useSearchParams();

  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  return useQuery({
    queryKey: [QueryKeys.categoriesList, groupId ?? "all", origin],
    queryFn: () => listAllCategories(origin || "outgoing", groupId || null),
  });
};
