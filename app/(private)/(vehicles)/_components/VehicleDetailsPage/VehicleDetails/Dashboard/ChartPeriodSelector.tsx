"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";

export type VehicleChartPeriod =
  | "current_month"
  | "last_30_days"
  | "3_months"
  | "6_months"
  | "year"
  | "2_years"
  | "all_time";

const PERIODS: VehicleChartPeriod[] = [
  "current_month",
  "last_30_days",
  "3_months",
  "6_months",
  "year",
  "2_years",
  "all_time",
];

const PERIOD_LABEL_MAP: Record<VehicleChartPeriod, string> = {
  current_month: "currentMonth",
  last_30_days: "last30Days",
  "3_months": "last3Months",
  "6_months": "last6Months",
  year: "lastYear",
  "2_years": "last2Years",
  all_time: "allTime",
};

export function ChartPeriodSelector<TPeriod extends VehicleChartPeriod>({
  value,
  onChange,
}: {
  value: TPeriod;
  onChange: (value: TPeriod) => void;
}) {
  const t = useTranslations("Vehicles");
  const selectedLabel = t(PERIOD_LABEL_MAP[value] as any);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-full justify-between bg-background/70 px-3 text-sm font-medium sm:min-w-[180px]"
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[190px]">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) => onChange(nextValue as TPeriod)}
        >
          {PERIODS.map((period) => (
            <DropdownMenuRadioItem key={period} value={period}>
              {t(PERIOD_LABEL_MAP[period] as any)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
