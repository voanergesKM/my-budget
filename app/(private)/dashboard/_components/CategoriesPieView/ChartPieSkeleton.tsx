import { Card, CardContent } from "@/app/ui/shadcn/Card";
import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export const ChartPieSkeleton = () => {
  return (
    <Card className="xl:max-w-[850px]">
      <CardContent className="relative flex flex-1 flex-col justify-between p-4 md:p-6 lg:flex-row 2xl:gap-6">
        <div className="relative mx-auto h-[280px] w-[280px] animate-pulse rounded-full bg-gradient-to-br from-gray-300/60 to-gray-200/40 md:h-[320px] md:w-[320px] lg:h-[300px] lg:w-[300px] xl:h-[400px] xl:w-[400px]" />

        <div className="mx-auto mt-4 w-full space-y-4 lg:w-[300px] 2xl:w-[375px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-gray-700/30 p-3 lg:p-1"
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
      </CardContent>
    </Card>
  );
};
