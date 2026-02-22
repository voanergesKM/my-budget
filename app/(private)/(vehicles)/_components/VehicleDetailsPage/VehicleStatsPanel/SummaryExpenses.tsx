import { useTranslations } from "next-intl";

import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { VehicleStats } from "@/app/lib/types/vehicle";

type Props = {
  stats: VehicleStats;
};

function SummaryExpenses({ stats }: Props) {
  const tt = useTranslations("Table");
  const t = useTranslations("Vehicles");

  const { fuel, expenses } = stats;

  const title = t("expensesSummary");
  const currency = (stats?.expenses?.summary?.currency as string) || "EUR";

  const fuelCost = fuel?.totals?.totalAmount as number;
  const expensesCost = expenses?.summary?.totalAmount as number;
  const totalCost = fuelCost + expensesCost;

  const totalTrip = fuel?.totals?.totalTrip as number;

  const oneKmCost = getFormattedAmount(currency, totalCost / totalTrip);

  const totalFuelSpent = getFormattedAmount(currency, fuelCost);

  const totalExpenses = getFormattedAmount(currency, expensesCost);

  const totalSpent = getFormattedAmount(currency, totalCost);

  return (
    <StatCard>
      <>
        <div className="text-md flex items-center gap-2 text-muted-foreground">
          <span>{title}</span>
        </div>

        <div className={`flex flex-col gap-2 text-muted-foreground`}>
          <p className={"flex gap-2 text-text-primary"}>
            {t("totalFuelCost")}:<span className={""}>{totalFuelSpent}</span>
          </p>

          <p className={"flex gap-2 text-text-primary"}>
            {t("totalExpensesCost")}:<span className={""}>{totalExpenses}</span>
          </p>

          <p className={"flex gap-2 text-text-primary"}>
            {tt("totalAmount")}:<span className={""}>{totalSpent}</span>
          </p>

          <p className={"flex gap-2 text-text-primary"}>
            {t("oneKilometerCost")}:<span>{oneKmCost}</span>
          </p>
        </div>
      </>
    </StatCard>
  );
}

export default SummaryExpenses;
