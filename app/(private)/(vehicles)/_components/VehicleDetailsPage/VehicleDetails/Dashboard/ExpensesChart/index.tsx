"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Banknote } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/app/ui/shadcn/Card";

import { ChartPeriodSelector } from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/Dashboard/ChartPeriodSelector";
import { useVehicleExpensesChart } from "@/app/(private)/(vehicles)/_hooks/useVehicleExpensesChart";
import {
  ExpensesChartPeriod,
  ExpensesChartPoint,
} from "@/app/api/vehicles/expenses/chart/route";
import { SERVICE_CATEGORIES } from "@/app/lib/constants";

// ─── Constants & Colors ──────────────────────────────────────────────────────

// Generate a color map for all possible categories
const CATEGORY_COLORS: Record<string, string> = {
  fuel: "hsl(var(--chart-1))",
  maintenance: "hsl(var(--chart-2))",
  repair: "hsl(var(--chart-3))",
  tires: "hsl(var(--chart-4))",
  insurance: "hsl(var(--chart-5))",
};

const EXTRA_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#64748b",
  "#06b6d4",
];

let colorIndex = 0;
SERVICE_CATEGORIES.forEach((cat) => {
  if (!CATEGORY_COLORS[cat]) {
    CATEGORY_COLORS[cat] = EXTRA_COLORS[colorIndex % EXTRA_COLORS.length];
    colorIndex++;
  }
});

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ExpensesTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const tVehicles = useTranslations("Vehicles");
  const tCategories = useTranslations("VehicleExpenseCategory");

  if (!active || !payload?.length) return null;

  // Calculate total
  const total = payload.reduce((sum, item) => sum + (item.value as number), 0);

  // Sort payload by value descending so biggest expenses are on top
  const sortedPayload = [...payload].sort(
    (a, b) => (b.value as number) - (a.value as number)
  );

  return (
    <div className="min-w-[180px] rounded-xl border border-border/50 bg-background/95 px-3 py-3 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-2 border-b border-border/50 pb-1.5 font-semibold text-foreground">
        {label}
      </p>

      <div className="space-y-1.5 text-muted-foreground">
        {sortedPayload.map((item, idx) => {
          const categoryName =
            item.dataKey === "fuel"
              ? tVehicles("fuelCost")
              : tCategories(item.dataKey as any);
          return (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{categoryName}</span>
              </div>
              <span className="font-mono font-medium text-foreground">
                {Number(item.value).toFixed(2)}
              </span>
            </div>
          );
        })}

        <div className="mt-2 flex justify-between gap-4 border-t border-border/50 pt-2 font-semibold text-foreground">
          <span>{tVehicles("total")}</span>
          <span className="font-mono">{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Skeletons & Empty States ─────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="flex h-[220px] animate-pulse items-end gap-3 px-4 pb-4">
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

function EmptyState() {
  const t = useTranslations("Vehicles");

  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-muted-foreground">
      <Banknote className="h-8 w-8 opacity-30" />
      <p className="text-sm">{t("noChartData")}</p>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateLabel(
  dateKey: string,
  locale: string,
  isMonth: boolean
): string {
  // dateKey can be "YYYY-MM" or "YYYY-MM-DD"
  const parts = dateKey.split("-").map(Number);

  if (isMonth) {
    const date = new Date(parts[0], parts[1] - 1, 1);
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "2-digit",
    }).format(date);
  } else {
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
    }).format(date);
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExpensesChart() {
  const [period, setPeriod] = useState<ExpensesChartPeriod>("last_30_days");
  const t = useTranslations("Vehicles");
  const locale = useLocale();

  const { data: response, isLoading } = useVehicleExpensesChart(period);

  const chartData = response?.data;
  const isEmpty =
    !isLoading && (!chartData?.data || chartData.data.length === 0);
  const isMonthLevel = period !== "current_month" && period !== "last_30_days";

  // Identify all active categories across all data points
  const activeCategories = new Set<string>();

  const rechartsData = (() => {
    if (!chartData?.data || chartData.data.length === 0) return [];

    return (chartData.data as ExpensesChartPoint[]).map((d) => {
      // Find which categories are used in this point
      Object.keys(d).forEach((k) => {
        if (k !== "dateKey" && d[k] && typeof d[k] === "number" && d[k] > 0) {
          activeCategories.add(k);
        }
      });

      return {
        ...d,
        label: formatDateLabel(d.dateKey, locale, isMonthLevel),
      };
    });
  })();

  const activeCategoriesList = Array.from(activeCategories);

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-1/10">
              <Banknote className="h-4 w-4 text-chart-1" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("totalExpensesChart")}
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
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={rechartsData}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
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
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
                width={40}
              />
              <Tooltip
                content={<ExpensesTooltip />}
                cursor={{ fill: "hsl(var(--muted)/0.4)" }}
              />

              {/* Stacked Bars for each active category */}
              {activeCategoriesList.map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={CATEGORY_COLORS[category] || CATEGORY_COLORS.other}
                  radius={
                    // Slight radius for visual appeal. Ideally we'd only radius the top block,
                    // but stack radius is complex in recharts. [4, 4, 0, 0] works ok.
                    [2, 2, 0, 0]
                  }
                  maxBarSize={50}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
