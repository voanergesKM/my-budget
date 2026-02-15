import { useTranslations } from "next-intl";

import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { formatStatsValue } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/utils";
import { StatsBlock } from "@/app/lib/types/vehicle";

function FuelSummary({ cardValue }: { cardValue: StatsBlock }) {
  const translate = useTranslations("Table");

  const title = translate("fuelSummary");

  const totalSpent = getFormattedAmount(
    cardValue.currency as string,
    cardValue.totalAmount as number
  );

  return (
    <StatCard>
      <>
        <div className="text-md flex items-center gap-2 text-muted-foreground">
          <span>{title}</span>
        </div>

        <div
          className={
            "flex items-center justify-between gap-2 px-4 text-text-secondary md:px-2"
          }
        >
          <div className={"flex flex-col gap-2"}>
            <p className={"flex gap-2 text-text-primary"}>
              {translate("amount")}:
              <span className={"text-text-secondary"}>{totalSpent}</span>
            </p>

            <p className={"flex gap-2 text-text-primary"}>
              {translate("totalTrip")}:
              <span className={"text-text-secondary"}>
                {formatStatsValue(cardValue?.totalTrip)} km
              </span>
            </p>
            <p className={"flex gap-2 text-text-primary"}>
              {translate("totalAmount")}:
              <span className={"text-text-secondary"}>
                {formatStatsValue(cardValue?.totalLiters)} L
              </span>
            </p>
          </div>
        </div>
      </>
    </StatCard>
  );
}

export default FuelSummary;
