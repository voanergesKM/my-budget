"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CircleDollarSign, Fuel } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Dot,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/app/ui/shadcn/Card";

import { ChartPeriodSelector } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/Dashboard/ChartPeriodSelector";
import { useVehicleFuelChart } from "@/app/(private)/(vehicles)/_hooks/useVehicleFuelChart";
import {
  FuelChartCostPerKmPoint,
  FuelChartMonthPoint,
  FuelChartPeriod,
  FuelChartRefuelingPoint,
} from "@/app/api/vehicles/fuel-records/chart/route";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

type FuelChartType = "consumption" | "cost" | "pricePerLiter" | "costPerKm";

function CurrentMonthTooltip({
  active,
  payload,
  locale,
  chartType,
}: TooltipProps<number, string> & {
  locale: string;
  chartType: FuelChartType;
}) {
  const t = useTranslations("Table");
  const tVehicles = useTranslations("Vehicles");

  if (!active || !payload?.length) return null;

  const d = payload[0].payload as FuelChartRefuelingPoint;

  const date = new Date(d.date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="min-w-[160px] rounded-xl border border-border/50 bg-background/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 font-semibold text-foreground">{date}</p>
      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between gap-4">
          <span>{getTooltipLabel(chartType, t, tVehicles)}</span>
          <span className="font-mono font-semibold text-foreground">
            {formatChartValue(
              getPointValue(d, chartType),
              chartType,
              d.currency
            )}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{t("liters")}</span>
          <span className="font-mono text-foreground">{d.liters} л</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{t("trip")}</span>
          <span className="font-mono text-foreground">{d.trip} км</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{t("odometer")}</span>
          <span className="font-mono text-foreground">{d.odometer} км</span>
        </div>
        {d.station && (
          <div className="mt-1 truncate border-t border-border/50 pt-1 text-muted-foreground">
            {d.station}
          </div>
        )}
      </div>
    </div>
  );
}

function MonthTooltip({
  active,
  payload,
  locale,
  chartType,
}: TooltipProps<number, string> & {
  locale: string;
  chartType: FuelChartType;
}) {
  const t = useTranslations("Vehicles");
  const tTable = useTranslations("Table");

  if (!active || !payload?.length) return null;

  const d = payload[0].payload as FuelChartMonthPoint;
  const label = formatMonthLabel(d.month, locale);

  return (
    <div className="min-w-[160px] rounded-xl border border-border/50 bg-background/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between gap-4">
          <span>{getTooltipLabel(chartType, tTable, t)}</span>
          <span className="font-mono font-semibold text-foreground">
            {formatChartValue(getMonthValue(d, chartType), chartType)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{tTable("consumption")}</span>
          <span className="font-mono text-foreground">
            {d.count} {t("refueling")}
          </span>
        </div>
      </div>
    </div>
  );
}


function CostPerKmTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const tVehicles = useTranslations("Vehicles");
  const tTable = useTranslations("Table");

  if (!active || !payload?.length) return null;

  const d = payload[0].payload as FuelChartCostPerKmPoint;

  return (
    <div className="min-w-[180px] rounded-xl border border-border/50 bg-background/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between gap-4">
          <span>{tVehicles("fuelCostPerKm")}</span>
          <span className="font-mono font-semibold text-foreground">
            {formatChartValue(d.costPerKm, "costPerKm")}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{tVehicles("fuel")}</span>
          <span className="font-mono text-foreground">{d.fuelAmount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{tVehicles("service")}</span>
          <span className="font-mono text-foreground">{d.serviceAmount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{tTable("totalTrip")}</span>
          <span className="font-mono text-foreground">{d.totalTrip} км</span>
        </div>
        <div className="mt-1 flex justify-between gap-4 border-t border-border/50 pt-1 font-semibold text-foreground">
          <span>{tVehicles("total")}</span>
          <span className="font-mono">{d.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Chart skeleton ───────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="flex h-[180px] animate-pulse items-end gap-3 px-4 pb-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-muted"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  const t = useTranslations("Vehicles");

  return (
    <div className="flex h-[180px] flex-col items-center justify-center gap-2 text-muted-foreground">
      <Fuel className="h-8 w-8 opacity-30" />
      <p className="text-sm">{t("noChartData")}</p>
    </div>
  );
}

// ─── Chart dot ────────────────────────────────────────────────────────────────

const ActiveDot = (props: any) => {
  const { cx, cy, chartType } = props;
  const color =
    chartType === "cost"
      ? "hsl(var(--chart-2))"
      : chartType === "pricePerLiter"
        ? "hsl(var(--chart-3))"
        : chartType === "costPerKm"
          ? "hsl(var(--chart-4))"
          : "hsl(var(--primary))";
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={5}
      fill={color}
      stroke="hsl(var(--background))"
      strokeWidth={2}
    />
  );
};

const InactiveDot = (props: any) => {
  const { cx, cy, chartType } = props;
  const color =
    chartType === "cost"
      ? "hsl(var(--chart-2))"
      : chartType === "pricePerLiter"
        ? "hsl(var(--chart-3))"
        : chartType === "costPerKm"
          ? "hsl(var(--chart-4))"
          : "hsl(var(--primary))";
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={3}
      fill={color}
      stroke="hsl(var(--background))"
      strokeWidth={1.5}
    />
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateKeyLabel(dateKey: string, locale: string, isMonthLevel: boolean) {
  if (isMonthLevel) {
    return formatMonthLabel(dateKey, locale);
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });
}

function formatMonthLabel(monthKey: string, locale: string): string {
  // monthKey is "YYYY-MM"
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function getPointValue(
  point: FuelChartRefuelingPoint,
  chartType: FuelChartType
) {
  switch (chartType) {
    case "cost":
      return point.amount;
    case "pricePerLiter":
      return point.pricePerLiter;
    case "costPerKm":
      return point.costPerKm;
    case "consumption":
    default:
      return point.consumption;
  }
}

function getMonthValue(point: FuelChartMonthPoint, chartType: FuelChartType) {
  switch (chartType) {
    case "cost":
      return point.totalAmount;
    case "pricePerLiter":
      return point.avgPricePerLiter;
    case "costPerKm":
      return point.costPerKm;
    case "consumption":
    default:
      return point.avgConsumption;
  }
}

function getChartTitleKey(chartType: FuelChartType) {
  switch (chartType) {
    case "cost":
      return "fuelCostChart";
    case "pricePerLiter":
      return "fuelPricePerLiterChart";
    case "costPerKm":
      return "fuelCostPerKmChart";
    case "consumption":
    default:
      return "fuelConsumptionChart";
  }
}

function getChartColor(chartType: FuelChartType) {
  switch (chartType) {
    case "cost":
      return "hsl(var(--chart-2))";
    case "pricePerLiter":
      return "hsl(var(--chart-3))";
    case "costPerKm":
      return "hsl(var(--chart-4))";
    case "consumption":
    default:
      return "hsl(var(--primary))";
  }
}

function getTooltipLabel(
  chartType: FuelChartType,
  tTable: ReturnType<typeof useTranslations>,
  tVehicles: ReturnType<typeof useTranslations>
) {
  switch (chartType) {
    case "cost":
      return tVehicles("fuelCost");
    case "pricePerLiter":
      return tVehicles("fuelPricePerLiter");
    case "costPerKm":
      return tVehicles("fuelCostPerKm");
    case "consumption":
    default:
      return tTable("consumption");
  }
}

function formatChartValue(
  value: number | null,
  chartType: FuelChartType,
  currency?: string
) {
  if (value == null) return "—";

  switch (chartType) {
    case "cost":
      return currency ? `${value} ${currency}` : value;
    case "pricePerLiter":
      return currency ? `${value} ${currency}/л` : `${value}/л`;
    case "costPerKm":
      return currency ? `${value} ${currency}/км` : `${value}/км`;
    case "consumption":
    default:
      return `${value} л/100км`;
  }
}

// ─── Main chart component ─────────────────────────────────────────────────────

export default function FuelChart({
  chartType = "consumption",
}: {
  chartType?: FuelChartType;
}) {
  const [period, setPeriod] = useState<FuelChartPeriod>("last_30_days");
  const t = useTranslations("Vehicles");
  const locale = useLocale();

  const { data: response, isLoading } = useVehicleFuelChart(period);

  const chartData = response?.data;
  const activeData =
    chartType === "costPerKm" ? chartData?.costPerKmData : chartData?.data;
  const isEmpty = !isLoading && (!activeData || activeData.length === 0);

  const isDetailedPeriod =
    period === "current_month" || period === "last_30_days";
  const titleKey = getChartTitleKey(chartType);
  const chartColor = getChartColor(chartType);
  const ChartIcon = chartType === "consumption" ? Fuel : CircleDollarSign;

  // Shape data for recharts
  const rechartsData = (() => {
    if (!activeData || activeData.length === 0) return [];

    if (chartType === "costPerKm") {
      return (activeData as FuelChartCostPerKmPoint[]).map((d) => ({
        ...d,
        label: formatDateKeyLabel(d.dateKey, locale, !isDetailedPeriod),
        value: d.costPerKm,
      }));
    }

    if (isDetailedPeriod) {
      return (activeData as FuelChartRefuelingPoint[])
        .filter((d) => getPointValue(d, chartType) != null)
        .map((d) => ({
          ...d,
          label: new Date(d.date).toLocaleDateString(locale, {
            day: "2-digit",
            month: "short",
          }),
          value: getPointValue(d, chartType),
        }));
    }

    return (activeData as FuelChartMonthPoint[])
      .filter((d) => getMonthValue(d, chartType) != null)
      .map((d) => ({
        ...d,
        label: formatMonthLabel(d.month, locale),
        value: getMonthValue(d, chartType),
      }));
  })();

  // Y-axis domain with some padding
  const values = rechartsData.map((d) => d.value as number).filter(Boolean);
  const minVal = values.length ? Math.max(0, Math.min(...values) - 1) : 0;
  const maxVal = values.length ? Math.max(...values) + 1 : 20;

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <ChartIcon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {t(titleKey)}
            </h3>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[220px]">
            <ChartPeriodSelector value={period} onChange={setPeriod} />
          </div>
        </div>

        {/* Chart area */}
        {isLoading && <ChartSkeleton />}

        {isEmpty && !isLoading && <EmptyState />}

        {!isLoading && !isEmpty && (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={rechartsData}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`colorGradient-${chartType}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-border/40"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                domain={[minVal, maxVal]}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
                width={36}
              />
              <Tooltip
                content={
                  chartType === "costPerKm" ? (
                    <CostPerKmTooltip />
                  ) : isDetailedPeriod ? (
                    <CurrentMonthTooltip
                      locale={locale}
                      chartType={chartType}
                    />
                  ) : (
                    <MonthTooltip locale={locale} chartType={chartType} />
                  )
                }
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeDasharray: "4 2",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#colorGradient-${chartType})`}
                dot={<InactiveDot chartType={chartType} />}
                activeDot={<ActiveDot chartType={chartType} />}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
