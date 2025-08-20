import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export const PageTabsSkeleton = () => {
  return (
    <div className="mb-1 flex items-center justify-between py-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-full md:w-[170px] md:rounded-md" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
};
