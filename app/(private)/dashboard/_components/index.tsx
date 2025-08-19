"use client";

import dynamic from "next/dynamic";

import { CategoryTypeTabs } from "@/app/ui/components/CategoryTypeTabs";
import PageFilter from "@/app/ui/components/common/PageFilter";

import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useCategoryStats } from "../hooks/useCategoryStats";

import { ChartPieSkeleton } from "./CategoriesPieView/ChartPieSkeleton";

const CategoriesPieView = dynamic(() => import("./CategoriesPieView"), {
  ssr: false,
  loading: () => <ChartPieSkeleton />,
});

function Dashboard() {
  const { data, isLoading, isError } = useCategoryStats();

  return (
    <div className="mt-4">
      <CategoryTypeTabs
        actions={
          <PageFilter>
            <PageFilter.DateFilter />
          </PageFilter>
        }
      >
        <CategoriesPieView
          data={data}
          isLoading={isLoading}
          isError={isError}
        />
      </CategoryTypeTabs>
    </div>
  );
}

export default withUserAndGroupContext(Dashboard);
