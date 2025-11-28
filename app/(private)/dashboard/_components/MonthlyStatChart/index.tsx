import React, { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { SummaryByMonth } from "@/app/lib/definitions";

import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/app/ui/shadcn/Chart";

const chartConfig = {
  UAH: { label: "UAH", color: "var(--chart-1)" },
  USD: { label: "USD", color: "var(--chart-2)" },
} satisfies ChartConfig;

const defaultBarColors = [
  "hsl(187 42% 52%)",
  "hsl(202 35% 47%)",
  "hsl(173 39% 57%)",
  "hsl(199 40% 36%)",
  "hsl(210 34% 29%)",
  "hsl(188 38% 65%)",
  "hsl(197 32% 72%)",
  "hsl(207 26% 78%)",
  "hsl(219 23% 83%)",
  "hsl(228 18% 88%)",
];

function MonthlyStatChart({ data }: { data: SummaryByMonth | undefined }) {
  const t = useTranslations("Dashboard");

  const currencies = useMemo(() => {
    if (!data) {
      return [];
    }
    return Array.from(
      new Set(Object.values(data).flatMap((curr) => Object.keys(curr || {})))
    );
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <Card className="md:max-w-[400px] 2xl:max-w-[640px]">
      <CardContent>
        <CardHeader className="font-semibold text-text-primary">
          {t("monthlySummaryByCurrency")}
        </CardHeader>
        <ChartContainer
          config={chartConfig}
          className="xl:max-h-[200px] 2xl:max-h-[450px] 2xl:w-[600px]"
        >
          <BarChart accessibilityLayer={false} data={data} layout="vertical">
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={85}
            />
            <XAxis type="number" hide />

            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;

                const month = payload[0].payload.month; // Get the month from the first payload item
                const currencyTotals = payload.map((item) => {
                  const currency = (item as { dataKey: string }).dataKey.split(
                    "."
                  )[0]; // Extract currency from dataKey
                  const total = item.payload[currency]?.total || 0; // Get total value
                  return { currency, total, fill: item.fill! }; // Return an object for ChartTooltipContent
                });

                return (
                  <Tooltip month={month} currencyTotals={currencyTotals} />
                );
              }}
            />
            {currencies.map((currency, index) => {
              const dataKey = `${currency}.amountInBaseCurrency`;

              return (
                <Bar
                  key={currency}
                  dataKey={dataKey}
                  fill={defaultBarColors[index % defaultBarColors.length]}
                  radius={4}
                  stackId="a"
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default memo(MonthlyStatChart);

type ChartTooltipContentProps = {
  month: string;
  currencyTotals: { currency: string; total: number; fill: string }[];
};

const Tooltip = ({ month, currencyTotals }: ChartTooltipContentProps) => {
  return (
    <div className="rounded-sm bg-background p-2">
      <p className="mb-2 font-bold">{month}</p>
      <ul>
        {currencyTotals.map(({ currency, total, fill }) => {
          return (
            <li key={currency} className="flex items-center gap-1">
              <div
                className="h-3 w-2 rounded-sm"
                style={{ backgroundColor: fill }}
              />
              <strong>{currency}:</strong>
              {total}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
