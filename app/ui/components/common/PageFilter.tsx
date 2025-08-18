"use client";

import { createContext, useCallback, useContext } from "react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Filter, FilterX, X } from "lucide-react";

import { getCurrentMonthRange } from "@/app/lib/utils/getCurrentDateRange";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";
import { Separator } from "@/app/ui/shadcn/Separator";

import DatePicker from "./DatePicker";

type PageFilterState = {
  from: string | null;
  to: string | null;
};

type PageFilterActions = {
  reset: () => void;
  setRange: (from: Date, to: Date) => void;
};

const PageFilterStateContext = createContext<PageFilterState | null>(null);
const PageFilterActionsContext = createContext<PageFilterActions | null>(null);

export const usePageFilter = () => {
  const ctx = useContext(PageFilterStateContext);
  if (!ctx) {
    throw new Error("usePageFilter must be used within PageFilterProvider");
  }
  return ctx;
};

export const usePageFilterActions = () => {
  const ctx = useContext(PageFilterActionsContext);
  if (!ctx) {
    throw new Error(
      "usePageFilterActions must be used within PageFilterProvider"
    );
  }
  return ctx;
};

const PageFilter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tc = useTranslations("Common.buttons");

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const reset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const setRange = useCallback(
    (from: Date, to: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", from.toISOString());
      params.set("to", to.toISOString());

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <PageFilterStateContext.Provider value={{ from, to }}>
      <PageFilterActionsContext.Provider value={{ reset, setRange }}>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon">
              <Filter />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] space-y-4"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex justify-between">
              <Button onClick={reset} size={"sm"} className="ml-auto">
                <FilterX />
                {tc("clearFilter")}
              </Button>
            </div>
            <Separator />
            {children}
          </PopoverContent>
        </Popover>
      </PageFilterActionsContext.Provider>
    </PageFilterStateContext.Provider>
  );
};

PageFilter.DateFilter = function PageDateFilter() {
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
};

export default PageFilter;
