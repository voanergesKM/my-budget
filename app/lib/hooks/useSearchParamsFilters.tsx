import { useGroupIdFromSearchParams } from "./useGroupIdFromSearchParams";
import { usePaginationParams } from "./usePaginationParams";

export const useSearchParamsFilters = () => {
  const groupId = useGroupIdFromSearchParams();

  const { currentPage, pageSize } = usePaginationParams();

  return {
    groupId,
    currentPage,
    pageSize,
  };
};
