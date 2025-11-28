import { cn } from "@/app/lib/utils/utils";

import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/Card";
import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export function MonthlyStatChartSkeleton() {
  const fakeMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <Card className="md:max-w-[400px] 2xl:max-w-[640px]">
      <CardContent>
        <CardHeader className="font-semibold text-text-primary">
          <Skeleton className="h-5 w-48" />
        </CardHeader>

        <div className="flex gap-4 xl:max-h-[200px] 2xl:max-h-[450px] 2xl:w-[600px]">
          {/* Y Axis (months) */}
          <div className="flex w-[85px] flex-col justify-between py-4">
            {fakeMonths.map((month) => (
              <Skeleton key={month} className="h-4 w-10" />
            ))}
          </div>

          {/* Bars */}
          <div className="flex flex-1 flex-col justify-between gap-2 py-2 2xl:gap-3">
            {fakeMonths.map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton
                  className={cn(
                    "rounded, h-6 2xl:h-11",
                    i % 3 === 0 && "w-4/5",
                    i % 3 === 1 && "w-3/5",
                    i % 3 === 2 && "w-4/6",
                    i % 3 === 3 && "w-5/6"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
