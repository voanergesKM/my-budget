import { useFormatter, useTranslations } from "next-intl";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { FuelHistoryMetric, FuelHistoryValue } from "@/app/lib/types/vehicle";
import { convertDistance, convertFuel } from "@/app/lib/vehicle/units";

import { useVehicleUnits } from "../VehicleUnitsContext";

function BaseCard({
  cardValue,
  type,
  isLast,
  metric = false,
}: {
  cardValue: FuelHistoryValue;
  type: FuelHistoryMetric;
  isLast: boolean;
  metric?: boolean;
}) {
  const t = useTranslations("Table");
  const tv = useTranslations("Vehicles");
  const format = useFormatter();
  const units = useVehicleUnits();
  const distanceUnit = metric ? "km" : units.distanceUnit;
  const fuelUnit = metric ? "l" : units.fuelUnit;
  const distanceLabel = distanceUnit === "mi" ? "mi" : "km";
  const fuelLabel = fuelUnit === "us_gal" ? "US gal" : "L";
  const multiplier =
    type === "kmPerLiter"
      ? convertDistance(1, "km", distanceUnit) * convertFuel(1, fuelUnit, "l")
      : type === "pricePerLiter"
        ? convertFuel(1, fuelUnit, "l")
        : type === "costPerKm"
          ? convertDistance(1, distanceUnit, "km")
          : 1;
  const value = (number: number | null) =>
    number == null
      ? "—"
      : format.number(number * multiplier, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
  const title =
    type === "consumption"
      ? `${t("consumption")} (l/100 km)`
      : type === "kmPerLiter"
        ? `${tv("fuelEfficiency")} (${distanceUnit === "mi" && fuelUnit === "us_gal" ? "MPG" : `${distanceLabel}/${fuelLabel}`})`
        : type === "pricePerLiter"
          ? `${tv("fuelPricePerUnit")} (${cardValue.currency ?? "—"}/${fuelLabel})`
          : type === "costPerKm"
            ? `${tv("distanceCost")} (${cardValue.currency ?? "—"}/${distanceLabel})`
            : `${t(type)}${cardValue.currency ? ` (${cardValue.currency})` : ""}`;

  return (
    <StatCard>
      <div className="flex h-full flex-col gap-4">
        <div className="text-md text-muted-foreground">{title}</div>
        {isLast ? (
          <div className="my-auto text-center text-xl text-green-300">
            {value(cardValue.avg)}
          </div>
        ) : (
          <div className="my-auto flex items-center justify-between gap-2 px-4 text-text-secondary md:px-2">
            <p className="flex flex-col items-center">
              <span>{t("min")}:</span>
              <span>{value(cardValue.min)}</span>
            </p>
            <p className="flex flex-col items-center gap-1 text-xl text-green-300">
              <span>{t("avg")}:</span>
              <span>{value(cardValue.avg)}</span>
            </p>
            <p className="flex flex-col items-center">
              <span>{t("max")}:</span>
              <span>{value(cardValue.max)}</span>
            </p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {isLast && cardValue.lastAt
            ? tv("historyLastDate", {
                date: format.dateTime(new Date(cardValue.lastAt), {
                  dateStyle: "medium",
                }),
              })
            : isLast
              ? tv("historyNoData")
              : tv("historyCount", {
                  count: cardValue.count,
                  total: cardValue.total,
                })}
        </p>
      </div>
    </StatCard>
  );
}

export default BaseCard;
