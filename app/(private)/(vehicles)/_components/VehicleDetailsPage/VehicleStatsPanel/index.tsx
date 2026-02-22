/* eslint-disable */

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/app/ui/shadcn/drawer";

import { Stats, VehicleStats } from "@/app/lib/types/vehicle";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import BaseCard from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/BaseCard";
import LastFullTankCard
  from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/LastFullTankCard";
import FuelSummary from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/FuelSummary";
import ExpensesByCategory
  from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/ExpensesByCategory";
import SummaryExpenses
  from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/SummaryExpenses";

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
        case "pricePerLiter":
        case "consumption":
        case "refuelCost":
        case "costPerKm":
          return <BaseCard type={key} cardValue={cardValue} />;

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

function StatsGrid({ fuel, currency }: { fuel: Stats; currency: string }) {
  const cards = getCard(fuel, currency);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
      {cards.map((Card, i) => (
        <div key={i}>{Card}</div>
      ))}
    </div>
  );
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
                <StatsGrid fuel={fuel} currency={fuelCurrency} />
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/*</div>*/}
    </>
  );
}
