import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export const ChartPieSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="relative h-[200px] w-[200px] animate-pulse rounded-full bg-gradient-to-br from-gray-300/60 to-gray-200/40 md:h-[320px] md:w-[320px]" />

      <div className="mt-4 max-h-[220px] w-full space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-gray-700/30 p-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div>
                <Skeleton className="mb-1 h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};
