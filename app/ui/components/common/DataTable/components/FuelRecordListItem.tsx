import { useFormatter, useTranslations } from "next-intl";

import { formatDate } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import CollapsibleItem from "@/app/ui/components/common/CollapsibleItem";
import { RowAction } from "@/app/ui/components/common/DataTable/components/RowActionMenu";
import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";

import { useVehicleUnits } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleUnitsContext";
import { FuelRecordType } from "@/app/lib/types/vehicle";
import {
  convertDistance,
  convertFuel,
  distancePerFuelFromConsumption,
} from "@/app/lib/vehicle/units";

export default function FuelRecordListItem({
  item,
  rowActions,
}: {
  item: FuelRecordType;
  rowActions: RowAction<FuelRecordType>[];
}) {
  const tTable = useTranslations("Table");
  const format = useFormatter();
  const tv = useTranslations("Vehicles");
  const { distanceUnit, fuelUnit, showMetricUnits } = useVehicleUnits();
  const distanceLabel = distanceUnit === "mi" ? "mi" : "km";
  const fuelLabel = fuelUnit === "us_gal" ? "US gal" : "L";
  const efficiency = distancePerFuelFromConsumption(
    item.consumption,
    distanceUnit,
    fuelUnit
  );
  const efficiencyUnit =
    distanceUnit === "mi" && fuelUnit === "us_gal"
      ? "MPG"
      : `${distanceLabel}/${fuelLabel}`;

  const amount = getFormattedAmount(item.currency, item.amount);
  const pricePerLiter = getFormattedAmount(
    item.currency,
    item.amount / item.liters
  );

  return (
    <CollapsibleItem
      title={
        <div className="flex flex-row justify-between gap-1">
          <div className="flex w-fit flex-col gap-1">
            <span className="inline-block origin-left scale-75 text-sm">
              {formatDate(item.createdAt, "short")}
            </span>
            <span className="inline-block origin-left scale-95 text-sm font-bold">
              {amount}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="scale-85 inline-block origin-left text-sm">
              {format.number(item.odometer)} {distanceLabel}
            </span>
            <span className="inline-block origin-left scale-75 text-sm">
              {item.trip > 0 && `+${format.number(item.trip)} ${distanceLabel}`}
            </span>
          </div>
        </div>
      }
      actions={rowActions}
      context={item}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 text-sm text-text-primary">
          {!!item.consumption &&
            ((distanceUnit === "km" && fuelUnit === "l") ||
              showMetricUnits) && (
              <>
                <span className="font-semibold">{tTable("consumption")}:</span>
                <span>{item.consumption.toFixed(2)} l/100km</span>
              </>
            )}

          {item.fullTank && !item.isMissed && efficiency != null && (
            <>
              <span className="font-semibold">{tv("fuelEfficiency")}:</span>
              <span>
                {format.number(efficiency, {
                  maximumFractionDigits: 2,
                })}{" "}
                {efficiencyUnit}
              </span>
            </>
          )}

          {showMetricUnits &&
            (distanceUnit !== "km" || fuelUnit !== "l") &&
            item.fullTank &&
            !item.isMissed &&
            efficiency != null && (
              <>
                <span className="font-semibold">{tTable("kmPerLiter")}:</span>
                <span>
                  {format.number(
                    distancePerFuelFromConsumption(
                      item.consumption,
                      "km",
                      "l"
                    )!,
                    { maximumFractionDigits: 2 }
                  )}{" "}
                  km/L
                </span>
              </>
            )}
          {showMetricUnits && distanceUnit === "mi" && (
            <>
              <span className="font-semibold">{tTable("odometer")} (km):</span>
              <span>
                {format.number(convertDistance(item.odometer, "mi", "km"), {
                  maximumFractionDigits: 2,
                })}{" "}
                km
              </span>
            </>
          )}

          <span className="font-semibold">{tv("fuelVolume")}:</span>
          <span>
            {item.liters} {fuelLabel}
          </span>
          {showMetricUnits && fuelUnit === "us_gal" && (
            <>
              <span className="font-semibold">{tv("fuelVolume")} (L):</span>
              <span>
                {format.number(convertFuel(item.liters, "us_gal", "l"), {
                  maximumFractionDigits: 2,
                })}{" "}
                L
              </span>
            </>
          )}

          <span className="font-semibold">
            {tv("fuelPricePerUnit")} / {fuelLabel}:
          </span>
          <span>{pricePerLiter}</span>

          <span className="font-semibold">{tTable("fullTank")}:</span>
          <span>{item.fullTank ? "✓" : "—"}</span>

          {!!item.city && (
            <>
              <span className="font-semibold">{tTable("city")}:</span>
              <span>{item.city}</span>
            </>
          )}

          {item.notes && (
            <>
              <span className="font-semibold">{tTable("notes")}:</span>
              <span>{item.notes}</span>
            </>
          )}
        </div>
        <div className={"flex items-center justify-between gap-2"}>
          <span className="font-semibold">{tTable("createdBy")}:</span>
          <UserViewItem user={item.createdBy} />
        </div>
      </div>
    </CollapsibleItem>
  );
}
