"use client";

import { createContext, useCallback, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Filter, FilterX } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";
import { Separator } from "@/app/ui/shadcn/Separator";

import { CategoryFilter } from "./CategoryFilter";
import { DateFilter } from "./DateFilter";

type PageFilterState = {
  from: string | null;
  to: string | null;
  cid: string | null;
};

type PageFilterActions = {
  reset: () => void;
  setRange: (from: Date, to: Date) => void;
  setCategory: (cid: string) => void;
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
  const cid = searchParams.get("cid");

  const reset = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");
    params.delete("cid");

    router.push(`?${params.toString()}`);
  }, []);

  const setRange = useCallback((from: Date, to: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from.toISOString());
    params.set("to", to.toISOString());

    router.push(`?${params.toString()}`);
  }, []);

  const setCategory = useCallback((categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cid", categoryId.toString());

    router.push(`?${params.toString()}`);
  }, []);

  return (
    <PageFilterStateContext.Provider value={{ from, to, cid }}>
      <PageFilterActionsContext.Provider
        value={{ reset, setRange, setCategory }}
      >
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

PageFilter.DateFilter = DateFilter;

PageFilter.CategoryFilter = CategoryFilter;

export default PageFilter;
