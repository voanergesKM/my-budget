import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getVehicleRecords } from "@/app/lib/api/vehicle/getVehicleRecords";

import { ScheduleRecordType } from "@/app/lib/types/vehicle";

export const useVehicleSchedulesRecordsList = () => {
  const { vehicleId } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  return useQuery({
    queryKey: QueryKeys.vehicleScheduleRecords(
      vehicleId as string,
      page || undefined,
      pageSize || undefined
    ),

    queryFn: () =>
      getVehicleRecords(
        "schedule",
        vehicleId as string,
        page ? +page : 1,
        pageSize ? +pageSize : 10
      ),
    select: (data) => {
      return {
        list: data.data.list as ScheduleRecordType[],
        totalPages: data.data.totalPages,
        hasMore: data.data.hasMore,
      };
    },
  });
};
