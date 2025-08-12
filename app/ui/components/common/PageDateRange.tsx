import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { getCurrentMonthRange } from "@/app/lib/utils/getCurrentDateRange";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import DatePicker from "./DatePicker";

export const PageDateRange = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const isMobile = useIsMobile();

  const handlePeriodChange = (period: Date | DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (period && "from" in period && period.from) {
      params.set("from", period.from.toISOString());
    }
    if (period && "to" in period && period.to) {
      params.set("to", period.to.toISOString());
    }

    router.push(`?${params.toString()}`);
  };

  const dateRange =
    from && to
      ? { from: new Date(from), to: new Date(to) }
      : getCurrentMonthRange();

  return (
    <DatePicker
      mode="range"
      currentValue={dateRange}
      variant={isMobile ? "icon" : "default"}
      onBlur={handlePeriodChange}
    />
  );
};
