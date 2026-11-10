"use client";

import { useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { UserViewItem } from "@/app/ui/components/common/DataTable/components/UserViewItem";

import { useVehicleUnits } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleUnitsContext";
import { FuelRecordType } from "@/app/lib/types/vehicle";
import {
  convertDistance,
  convertFuel,
  distancePerFuelFromConsumption,
} from "@/app/lib/vehicle/units";

export function useFieldRecordsColumns(): ColumnDef<FuelRecordType>[] {
  const t = useTranslations("Table");
  const format = useFormatter();
  const tv = useTranslations("Vehicles");
  const { distanceUnit, fuelUnit, showMetricUnits } = useVehicleUnits();
  const distanceLabel = distanceUnit === "mi" ? "mi" : "km";
  const fuelLabel = fuelUnit === "us_gal" ? "US gal" : "L";
  const isMetric = distanceUnit === "km" && fuelUnit === "l";

  return useMemo(() => {
    return [
      {
        accessorKey: "odometer",
        header: t("odometer"),
        cell: ({ getValue }) =>
          `${format.number(getValue<number>())} ${distanceLabel}`,
      },
      ...(showMetricUnits && distanceUnit === "mi"
        ? [
            {
              id: "odometerKm",
              header: `${t("odometer")} (km)`,
              accessorFn: (row: FuelRecordType) =>
                convertDistance(row.odometer, "mi", "km"),
              cell: ({ getValue }: any) =>
                `${format.number(getValue(), { maximumFractionDigits: 2 })} km`,
            } as ColumnDef<FuelRecordType>,
          ]
        : []),
      {
        id: "city",
        header: t("city"),
        cell: ({ row }) => {
          const { city, station } = row.original;
          return [city].filter(Boolean).join(", ");
        },
      },
      {
        accessorKey: "amount",
        header: t("amount"),
        cell: ({ row }) => {
          const amount = row.original.amount;
          const currency = row.original.currency;
          const formatted = getFormattedAmount(currency, amount);
          return <span>{formatted}</span>;
        },
        meta: {
          className: "text-center w-[240px]",
        },
      },
      {
        accessorKey: "liters",
        header: tv("fuelVolume"),
        cell: ({ getValue }) => `${getValue()} ${fuelLabel}`,
      },
      ...(showMetricUnits && fuelUnit === "us_gal"
        ? [
            {
              id: "fuelLiters",
              header: `${tv("fuelVolume")} (L)`,
              accessorFn: (row: FuelRecordType) =>
                convertFuel(row.liters, "us_gal", "l"),
              cell: ({ getValue }: any) =>
                `${format.number(getValue(), { maximumFractionDigits: 2 })} L`,
            } as ColumnDef<FuelRecordType>,
          ]
        : []),
      ...(isMetric || showMetricUnits
        ? [
            {
              accessorKey: "consumption",
              header: t("consumption"),
              cell: ({ getValue }: any) => {
                const value = getValue() as number | null;
                return value && value > 0 ? `${value.toFixed(2)} L/100km` : "—";
              },
            } as ColumnDef<FuelRecordType>,
          ]
        : []),
      {
        id: "kmPerLiter",
        header: tv("fuelEfficiency"),
        accessorFn: (record) =>
          record.fullTank && !record.isMissed && record.consumption > 0
            ? distancePerFuelFromConsumption(
                record.consumption,
                distanceUnit,
                fuelUnit
              )
            : null,
        cell: ({ getValue }) => {
          const value = getValue<number | null>();
          return value == null
            ? "—"
            : `${format.number(value, { maximumFractionDigits: 2 })} ${distanceUnit === "mi" && fuelUnit === "us_gal" ? "MPG" : `${distanceLabel}/${fuelLabel}`}`;
        },
      },
      ...(showMetricUnits && !isMetric
        ? [
            {
              id: "metricEfficiency",
              header: t("kmPerLiter"),
              accessorFn: (record: FuelRecordType) =>
                record.fullTank && !record.isMissed
                  ? distancePerFuelFromConsumption(
                      record.consumption,
                      "km",
                      "l"
                    )
                  : null,
              cell: ({ getValue }: any) =>
                getValue() == null
                  ? "—"
                  : `${format.number(getValue(), { maximumFractionDigits: 2 })} km/L`,
            } as ColumnDef<FuelRecordType>,
          ]
        : []),
      {
        accessorKey: "trip",
        header: t("trip"),
        cell: ({ getValue }) =>
          `${getValue<number>() ? `${getValue<number>()} ${distanceLabel}` : "—"}`,
      },

      {
        id: "pricePerLiter",
        header: `${tv("fuelPricePerUnit")} / ${fuelLabel}`,
        cell: ({ row }) => {
          const { amount, liters } = row.original;
          return (amount / liters).toFixed(2);
        },
      },
      {
        accessorKey: "fullTank",
        header: t("fullTank"),
        cell: ({ getValue }) => (getValue() ? "✓" : "—"),
      },

      {
        accessorKey: "notes",
        header: t("notes"),
        cell: ({ getValue }) => getValue() || "—",
      },
      {
        accessorKey: "transaction",
        header: t("transaction"),
        cell: ({ getValue }) => (getValue() ? "✓" : "—"),
      },
      {
        accessorKey: "createdBy",
        header: t("createdBy"),
        cell: ({ row }) => <UserViewItem user={row.original.createdBy} />,
      },
      {
        accessorKey: "createdAt",
        header: t("createdAt"),
        cell: ({ row }) => formatWithTime(row.original.createdAt),
        meta: {
          className: "text-center w-[220px]",
        },
      },

      // {
      //   accessorKey: "updatedAt",
      //   header: t("updatedAt"),
      //   cell: ({ row }) => formatWithTime(row.original.updatedAt),
      //   meta: {
      //     className: "text-center w-[220px]",
      //   },
      // },
    ];
  }, [
    t,
    tv,
    format,
    distanceUnit,
    fuelUnit,
    distanceLabel,
    fuelLabel,
    isMetric,
    showMetricUnits,
  ]);
}
