import { useSearchParams } from "next/navigation";

import QueryKeys from "@/app/lib/utils/queryKeys";

export const useQueryKeys = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  return [
    QueryKeys.getTransactionsList,
    groupId ?? "all",
    origin,
    page,
    pageSize,
  ];
};
