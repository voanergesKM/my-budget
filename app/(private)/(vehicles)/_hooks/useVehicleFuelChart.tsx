import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getFuelChart } from "@/app/lib/api";

import { FuelChartPeriod } from "@/app/api/vehicles/fuel-records/chart/route";

export const useVehicleFuelChart = (period: FuelChartPeriod) => {
  const { vehicleId } = useParams();

  return useQuery({
    queryKey: QueryKeys.vehicleFuelChart(vehicleId as string, period),
    queryFn: () => getFuelChart(vehicleId as string, period),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
