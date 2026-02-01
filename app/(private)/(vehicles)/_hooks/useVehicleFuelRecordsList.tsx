import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getVehicleFuelRecords } from "@/app/lib/api/vehicle/getVehicleFuelRecords";

export const useVehicleFuelRecordsList = () => {
  const { vehicleId } = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  return useQuery({
    queryKey: QueryKeys.vehicleFuelRecords(
      vehicleId as string,
      page || undefined,
      pageSize || undefined
    ),

    queryFn: () =>
      getVehicleFuelRecords(
        vehicleId as string,
        page ? +page : 1,
        pageSize ? +pageSize : 10
      ),
  });
};
