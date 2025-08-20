import { Skeleton } from "@/app/ui/shadcn/Skeleton";

import { CategoriesSkeleton } from "@/app/ui/components/loaders/CategoriesSkeleton";

export default function Loading() {
  return (
    <>
      <div className="my-5 flex justify-end gap-4">
        <Skeleton className="h-[40px] w-36 rounded-sm" />
        <Skeleton className="h-[40px] w-36 rounded-sm" />
      </div>

      <CategoriesSkeleton />
    </>
  );
}
