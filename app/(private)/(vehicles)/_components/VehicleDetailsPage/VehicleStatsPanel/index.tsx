/* eslint-disable */

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent } from "@/app/ui/shadcn/Card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/app/ui/shadcn/drawer";

import { FuelStats, VehicleStats } from "@/app/lib/types/vehicle";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import BaseCard from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/BaseCard";
import LastFullTankCard
  from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/LastFullTankCard";
import FuelSummary from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel/FuelSummary";

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

function getCard(fuel: FuelStats) {
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

        default:
          return null;
      }
    })
    .filter(Boolean);
}

function StatsGrid({ fuel }: { fuel: FuelStats }) {
  const cards = getCard(fuel);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
      {cards.map((Card, i) => (
        <div key={i}>{Card}</div>
      ))}
    </div>
  );
}

export default function VehicleStatsPanel({ stats }: Props) {
  const fuel = stats?.fuel;

  const t = useTranslations("Vehicles");

  if (!fuel) return null;

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
            <StatsGrid fuel={fuel} />
          </div>
        </DrawerContent>
      </Drawer>
      {/*</div>*/}
    </>
  );
}
