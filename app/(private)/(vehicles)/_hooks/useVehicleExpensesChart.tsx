import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getExpensesChart } from "@/app/lib/api";

import { ExpensesChartPeriod } from "@/app/api/vehicles/expenses/chart/route";

export const useVehicleExpensesChart = (period: ExpensesChartPeriod) => {
  const { vehicleId } = useParams();

  return useQuery({
    queryKey: QueryKeys.vehicleExpensesChart(vehicleId as string, period),
    queryFn: () => getExpensesChart(vehicleId as string, period),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
