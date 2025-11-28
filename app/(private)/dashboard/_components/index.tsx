"use client";

import dynamic from "next/dynamic";

import { CategoryTypeTabs } from "@/app/ui/components/CategoryTypeTabs";
import PageFilter from "@/app/ui/components/common/PageFilter";

import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useCategoryStats } from "../hooks/useCategoryStats";
import { useSummaryByMonth } from "../hooks/useSummaryByMonth";

import { ChartPieSkeleton } from "./CategoriesPieView/ChartPieSkeleton";
import { MonthlyStatChartSkeleton } from "./MonthlyStatChart/MonthlyStatSkeleton";

const CategoriesPieView = dynamic(() => import("./CategoriesPieView"), {
  ssr: false,
  loading: () => <ChartPieSkeleton />,
});

const MonthlyStatChart = dynamic(() => import("./MonthlyStatChart"), {
  ssr: false,
  loading: () => <MonthlyStatChartSkeleton />,
});

function Dashboard() {
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    isError: categoriesError,
  } = useCategoryStats();

  const { data: summaryData } = useSummaryByMonth();

  return (
    <div className="mt-4">
      <CategoryTypeTabs
        actions={
          <PageFilter>
            <PageFilter.DateFilter />
          </PageFilter>
        }
      >
        <div className="flex flex-col gap-6 2xl:flex-row">
          <CategoriesPieView
            data={categoriesData}
            isLoading={loadingCategories}
            isError={categoriesError}
          />

          <MonthlyStatChart data={summaryData} />
        </div>
      </CategoryTypeTabs>
    </div>
  );
}

export default withUserAndGroupContext(Dashboard);
