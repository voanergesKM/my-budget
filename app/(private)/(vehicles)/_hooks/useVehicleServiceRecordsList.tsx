import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getVehicleRecords } from "@/app/lib/api";

import { ServiceRecordType } from "@/app/lib/types/vehicle";

export const useVehicleServiceRecordsList = () => {
  const { vehicleId } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  return useQuery({
    queryKey: QueryKeys.vehicleServiceRecords(
      vehicleId as string,
      page || undefined,
      pageSize || undefined
    ),

    queryFn: () =>
      getVehicleRecords(
        "service",
        vehicleId as string,
        page ? +page : 1,
        pageSize ? +pageSize : 10
      ),
    select: (data) => {
      return {
        list: data.data.list as ServiceRecordType[],
        totalPages: data.data.totalPages,
        hasMore: data.data.hasMore,
      };
    },
  });
};
