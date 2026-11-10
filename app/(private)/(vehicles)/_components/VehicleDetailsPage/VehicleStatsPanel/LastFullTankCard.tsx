import { useTranslations } from "next-intl";

import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { formatStatsValue } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/utils";
import { useVehicleUnits } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleUnitsContext";
import { StatsBlock } from "@/app/lib/types/vehicle";
import { distancePerFuelFromConsumption } from "@/app/lib/vehicle/units";

function LastFullTankCard({ cardValue }: { cardValue: StatsBlock }) {
  const { distanceUnit, fuelUnit, showMetricUnits } = useVehicleUnits();
  const translate = useTranslations("Table");
  const tv = useTranslations("Vehicles");
  const efficiency = distancePerFuelFromConsumption(
    cardValue.consumption as number | null,
    distanceUnit,
    fuelUnit
  );

  const title = translate("lastFullTank");

  const totalSpent = getFormattedAmount(
    cardValue.currency as string,
    cardValue.amount as number
  );

  const pricePerLiter = getFormattedAmount(
    cardValue.currency as string,
    cardValue.pricePerLiter as number
  );

  const res = {
    pricePerLiter: 54.065000000000005,
  };

  return (
    <StatCard>
      <>
        <div className="text-md flex items-center gap-2 text-muted-foreground">
          {/*<Icon size={16} />*/}
          <span>{title}</span>
        </div>

        <div
          className={
            "flex items-center justify-between gap-2 px-4 text-text-secondary md:px-2"
          }
        >
          <div className={"flex flex-col gap-2"}>
            <p className={"mb-2 flex gap-2 text-text-primary"}>
              {translate("refuelDate")}:
              <span className={"text-text-secondary"}>
                {formatWithTime(formatStatsValue(cardValue?.createdAt))}
              </span>
            </p>

            <p className={"flex gap-2 text-text-primary"}>
              {translate("amount")}:
              <span className={"text-text-secondary"}>{totalSpent}</span>
            </p>

            <p className={"flex gap-2 text-text-primary"}>
              {translate("trip")}:
              <span className={"text-text-secondary"}>
                {formatStatsValue(cardValue?.trip)} {distanceUnit}
              </span>
            </p>

            {((distanceUnit === "km" && fuelUnit === "l") ||
              showMetricUnits) && (
              <p className={"flex gap-2 text-text-primary"}>
                {translate("consumption")}:
                <span className={"text-text-secondary"}>
                  {formatStatsValue(cardValue?.consumption)} l/100km
                </span>
              </p>
            )}
            <p className={"flex gap-2 text-text-primary"}>
              {tv("fuelEfficiency")}:{" "}
              <span className={"text-text-secondary"}>
                {formatStatsValue(efficiency)}{" "}
                {distanceUnit === "mi" && fuelUnit === "us_gal"
                  ? "MPG"
                  : `${distanceUnit}/${fuelUnit === "us_gal" ? "US gal" : "L"}`}
              </span>
            </p>
            <p className={"flex gap-2 text-text-primary"}>
              {tv("fuelPricePerUnit")} ({fuelUnit === "us_gal" ? "US gal" : "L"}
              ):
              <span className={"text-text-secondary"}>{pricePerLiter}</span>
            </p>
          </div>
        </div>
      </>
    </StatCard>
  );
}

export default LastFullTankCard;
