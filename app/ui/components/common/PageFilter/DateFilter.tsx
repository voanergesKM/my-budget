import { DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";

import { getCurrentMonthRange } from "@/app/lib/utils/getCurrentDateRange";

import DatePicker from "@/app/ui/components/common/DatePicker";

import { usePageFilter, usePageFilterActions } from ".";

export function DateFilter() {
  const { from, to } = usePageFilter();
  const { setRange } = usePageFilterActions();

  const tc = useTranslations("Common.selectors");

  const dateRange =
    from && to
      ? { from: new Date(from), to: new Date(to) }
      : getCurrentMonthRange();

  return (
    <DatePicker
      mode="range"
      currentValue={dateRange}
      label={tc("date")}
      onBlur={(range) => {
        const dateRange = range as DateRange;
        if (dateRange.from && dateRange.to) {
          setRange(dateRange.from, dateRange.to);
        }
      }}
    />
  );
}
