import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getScheduledPayments } from "@/app/lib/api/sheduledPayments/getScheduledPayments";

import { useSearchParamsFilters } from "@/app/lib/hooks/useSearchParamsFilters";

export const useScheduledPaymentsList = () => {
  const { groupId, currentPage, pageSize } = useSearchParamsFilters();

  return useQuery({
    queryKey: [QueryKeys.scheduledPaymentsList(groupId, currentPage, pageSize)],
    queryFn: () => getScheduledPayments(groupId, currentPage, pageSize),
  });
};
