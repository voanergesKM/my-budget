import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

export const useFetchGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getUserGroups,
  });
};
