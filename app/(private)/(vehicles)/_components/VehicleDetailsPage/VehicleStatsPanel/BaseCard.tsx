import { useTranslations } from "next-intl";
import { DollarSignIcon, Fuel, PoundSterling } from "lucide-react";

import { StatCard } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/index";
import { formatStatsValue } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/utils";
import { StatsBlock } from "@/app/lib/types/vehicle";

function BaseCard({
  cardValue,
  type,
}: {
  cardValue: StatsBlock;
  type: "consumption" | "pricePerLiter" | "refuelCost" | "costPerKm";
}) {
  const translate = useTranslations("Table");

  const iconMap = {
    consumption: Fuel,
    pricePerLiter: DollarSignIcon,
    refuelCost: PoundSterling,
    costPerKm: PoundSterling,
  };

  const Icon = iconMap[type];

  const buildTitle = () => {
    switch (type) {
      case "consumption":
        return `${translate("consumption")} l/100km`;

      case "pricePerLiter":
      case "refuelCost":
      case "costPerKm":
        return `${translate(type)} ${cardValue?.currency}`;

      default:
        return translate(type);
    }
  };

  const title = buildTitle();

  return (
    <StatCard>
      <div className={"flex h-full flex-1 flex-col gap-4"}>
        <div className="text-md flex items-center gap-2 text-muted-foreground">
          {/*<Icon size={16} />*/}
          <span>{title}</span>
        </div>

        <div
          className={
            "my-auto flex items-center justify-between gap-2 px-4 text-text-secondary md:px-2"
          }
        >
          <p className={"flex flex-col items-center justify-center"}>
            <span>{translate("min")}:</span>
            <span>{formatStatsValue(cardValue?.min)}</span>
          </p>
          <p
            className={
              "flex flex-col items-center justify-center gap-1 text-xl text-green-300"
            }
          >
            <span>{translate("avg")}:</span>
            <span>{formatStatsValue(cardValue?.avg)}</span>
          </p>
          <p className={"flex flex-col items-center justify-center"}>
            <span>{translate("max")}:</span>
            <span>{formatStatsValue(cardValue?.max)}</span>
          </p>
        </div>
      </div>
    </StatCard>
  );
}

export default BaseCard;
