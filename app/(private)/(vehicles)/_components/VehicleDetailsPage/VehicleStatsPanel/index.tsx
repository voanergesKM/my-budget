/* eslint-disable */

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/ui/shadcn/drawer";

import { Stats, VehicleStats } from "@/app/lib/types/vehicle";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { useState } from "react";
import {
  FuelHistoryMetric,
  FuelHistoryPeriod,
  FuelHistoryStats,
} from "@/app/lib/types/vehicle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";
import { ChevronDown } from "lucide-react";
import BaseCard from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/BaseCard";
import LastFullTankCard from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/LastFullTankCard";
import FuelSummary from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/FuelSummary";
import ExpensesByCategory from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/ExpensesByCategory";
import SummaryExpenses from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/SummaryExpenses";
import { useVehicleUnits } from "../VehicleUnitsContext";

type Props = {
  stats?: VehicleStats;
};

export function StatCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full w-full"
    >
      <Card className="h-full rounded-2xl shadow-md">
        <CardContent className="relative h-full space-y-3 p-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getCard(fuel: Stats, currency: string) {
  return Object.entries(fuel)
    .filter(([key, cardValue]) => !!key && !!cardValue)
    .map(([key, cardValue]) => {
      if (!cardValue) return null;
      switch (key) {
        case "lastFullTank":
          return <LastFullTankCard cardValue={cardValue} />;

        case "totals":
          return <FuelSummary cardValue={cardValue} />;

        case "breakdown":
          return (
            <ExpensesByCategory cardValue={cardValue} currency={currency} />
          );

        default:
          return null;
      }
    })
    .filter(Boolean);
}

const historyPeriods: FuelHistoryPeriod[] = ["last", "3", "6", "12", "all"];
const historyMetrics: FuelHistoryMetric[] = [
  "consumption",
  "kmPerLiter",
  "pricePerLiter",
  "refuelCost",
  "costPerKm",
];

function FuelHistory({ history }: { history: FuelHistoryStats }) {
  const [period, setPeriod] = useState<FuelHistoryPeriod>("all");
  const t = useTranslations("Vehicles");
  const { distanceUnit, fuelUnit, showMetricUnits } = useVehicleUnits();
  const isMetric = distanceUnit === "km" && fuelUnit === "l";
  const label = (value: FuelHistoryPeriod) =>
    value === "last"
      ? t("historyLast")
      : value === "all"
        ? t("allTime")
        : t("historyRefuelings", { count: Number(value) });

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("historyDescription")}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[180px] justify-between gap-3"
            >
              {label(period)} <ChevronDown className="size-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={period}
              onValueChange={(value) => setPeriod(value as FuelHistoryPeriod)}
            >
              {historyPeriods.map((value) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {label(value)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {historyMetrics
          .filter(
            (metric) => metric !== "consumption" || isMetric || showMetricUnits
          )
          .map((metric) => (
            <BaseCard
              key={metric}
              type={metric}
              cardValue={history[period][metric]}
              isLast={period === "last"}
            />
          ))}
        {showMetricUnits &&
          !isMetric &&
          (
            [
              "kmPerLiter",
              ...(fuelUnit !== "l" ? ["pricePerLiter"] : []),
              ...(distanceUnit !== "km" ? ["costPerKm"] : []),
            ] as FuelHistoryMetric[]
          ).map((metric) => (
            <BaseCard
              key={`metric-${metric}`}
              type={metric}
              cardValue={history[period][metric]}
              isLast={period === "last"}
              metric
            />
          ))}
      </div>
    </div>
  );
}

function StatsGrid({ fuel, currency }: { fuel: Stats; currency: string }) {
  const cards = getCard(fuel, currency);

  return cards.map((Card, i) => <div key={i}>{Card}</div>);
}

function ExpensesGrid({
  expenses,
  currency,
}: {
  expenses: Stats;
  currency: string;
}) {
  const cards = getCard(expenses, currency);

  return cards.map((Card, i) => <div key={i}>{Card}</div>);
}

export default function VehicleStatsPanel({ stats }: Props) {
  const fuel = stats?.fuel;
  const expenses = stats?.expenses;

  const t = useTranslations("Vehicles");

  const expenseCurrency = String(expenses?.summary?.currency || "EUR");
  const fuelCurrency = String(fuel?.totals?.currency || "EUR");

  return (
    <>
      {/* desktop / tablet — inline grid */}
      {/*<div className="hidden w-full 2xl:block">*/}
      {/*  <StatsGrid fuel={fuel} />*/}
      {/*</div>*/}

      {/* mobile — drawer */}
      {/*<div className="2xl:hidden">*/}
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full gap-2 py-4 text-xs uppercase">
            <BarChart3 size={16} />
            {t("vehicleStats")}
          </Button>
        </DrawerTrigger>

        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader>
            <DrawerTitle className={"text-left"}>
              {t("vehicleStats")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-6">
            {expenses && (
              <>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,480px))] gap-4">
                  <SummaryExpenses stats={stats} />

                  <ExpensesGrid
                    expenses={expenses}
                    currency={expenseCurrency}
                  />
                  {fuel && <StatsGrid fuel={fuel} currency={fuelCurrency} />}
                </div>
              </>
            )}

            {fuel && (
              <>
                <p
                  className={"my-4 text-xl font-semibold text-muted-foreground"}
                >
                  {t("fuelSummary")}
                </p>
                {stats?.fuelHistory && (
                  <FuelHistory history={stats.fuelHistory} />
                )}
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/*</div>*/}
    </>
  );
}
