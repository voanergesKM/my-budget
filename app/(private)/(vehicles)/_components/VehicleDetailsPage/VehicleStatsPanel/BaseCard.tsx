import { useFormatter, useTranslations } from "next-intl";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { FuelHistoryMetric, FuelHistoryValue } from "@/app/lib/types/vehicle";

function BaseCard({
  cardValue,
  type,
  isLast,
}: {
  cardValue: FuelHistoryValue;
  type: FuelHistoryMetric;
  isLast: boolean;
}) {
  const t = useTranslations("Table");
  const tv = useTranslations("Vehicles");
  const format = useFormatter();
  const value = (number: number | null) =>
    number == null
      ? "—"
      : format.number(number, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
  const title =
    type === "consumption"
      ? `${t("consumption")} (l/100 km)`
      : type === "kmPerLiter"
        ? `${t("kmPerLiter")} (km/L)`
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
