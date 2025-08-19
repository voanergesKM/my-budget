import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { CategoryStat } from "@/app/lib/definitions";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";
import { useCurrencyRates } from "@/app/lib/hooks/useCurrencyRates";
import { useDefaultCurrency } from "@/app/lib/hooks/useDefaultCurrency";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/ui/shadcn/Chart";

import { getPieChartConfig } from "../../utils";

import { ChartPieSkeleton } from "./ChartPieSkeleton";
import { Legend } from "./Legend";
import { Tooltip } from "./Tooltip";

type Props = {
  data: CategoryStat[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const CategoriesPieView = ({ data, isLoading, isError }: Props) => {
  const isMobile = useIsMobile();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const t = useTranslations("Dashboard");

  const chartConfig = getPieChartConfig(data);

  const currencyRates = useCurrencyRates();
  const defaultCurrency = useDefaultCurrency();

  const innerRadius = isMobile ? 60 : 90;

  const totalSpent =
    data && currencyRates
      ? data.reduce((acc, curr) => {
          if (curr.currency !== defaultCurrency) {
            const convertedAmount =
              (curr.total / currencyRates.rates[curr.currency]) *
              currencyRates.rates[defaultCurrency];

            return acc + convertedAmount;
          }
          return acc + curr.total;
        }, 0)
      : 0;

  return (
    <Card className="flex max-w-[550px] flex-col">
      <CardContent className="relative flex-1">
        {isLoading && <ChartPieSkeleton />}

        {isError && (
          <p className="text-center text-sm text-red-400">Cant't load data</p>
        )}

        {!isLoading && !isError && data?.length === 0 && <NoData />}

        {!isLoading && !isError && data && data.length > 0 && (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square"
            >
              <PieChart>
                <defs>
                  {data.map((entry, index) => (
                    <linearGradient
                      id={`gradient-${index}`}
                      key={`${entry.categoryName}-${entry.currency}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={entry.categoryColor}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={entry.categoryColor}
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  ))}
                </defs>

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, entry) => (
                        <Tooltip item={entry} />
                      )}
                    />
                  }
                />

                <Pie
                  data={data.map((entry, index) => ({
                    ...entry,
                    fill: `url(#gradient-${index})`,
                    opacity:
                      selectedCategoryId &&
                      selectedCategoryId !== entry.categoryId
                        ? 0.3
                        : 1,
                  }))}
                  dataKey="amountInBaseCurrency"
                  nameKey="categoryName"
                  innerRadius={innerRadius}
                  // outerRadius={outerRadius}
                  stroke={"1"}
                  activeIndex={data.findIndex(
                    (entry) => entry.categoryId === selectedCategoryId
                  )}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <Sector {...props} outerRadius={outerRadius + 14} />
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="currentColor"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 8}
                              className="text-sm font-bold text-text-primary md:text-lg"
                            >
                              {getFormattedAmount(defaultCurrency, totalSpent)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 18}
                              className="text-xs text-text-secondary md:text-sm"
                            >
                              {t("pieTotalMessage")}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="w-full">
              <Legend
                items={data}
                selectedCategoryId={selectedCategoryId}
                onClick={(categoryId) =>
                  setSelectedCategoryId(
                    categoryId === selectedCategoryId ? null : categoryId
                  )
                }
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriesPieView;

const NoData = () => {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const groupId = searchParams.get("groupId");

  const td = useTranslations("Dashboard");
  const te = useTranslations("Entities");
  const tb = useTranslations("Common.buttons");

  const entityType = origin === "incoming" ? "income" : "expense";

  const buildHref = () => {
    const params = new URLSearchParams();

    if (origin) {
      params.set("origin", origin);
    }
    if (groupId) {
      params.set("groupId", groupId);
    }
    params.set("createTransaction", "true");

    return params.size > 0 ? `/?${params.toString()}` : "/";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
      <span className="text-lg font-medium text-text-primary">
        {td("noData", { entity: te(`${entityType}.plural`) })}
      </span>

      <Button href={buildHref()}>{tb("createTransaction")}</Button>
    </div>
  );
};
