import { PageTabsSkeleton } from "@/app/ui/components/loaders/PageTabsSkeleton";

import { ChartPieSkeleton } from "./_components/CategoriesPieView/ChartPieSkeleton";

export default function Loading() {
  return (
    <div className="mt-2 gap-2">
      <PageTabsSkeleton />
      <ChartPieSkeleton />
    </div>
  );
}
