import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export const GroupCardSkeleton = () => {
  return (
    <div className="min-h-[440px] w-full max-w-[370px] rounded-md bg-card p-6">
      <div className="flex flex-col items-center">
        <Skeleton className="h-[250px] w-[250px] rounded-full" />
        <Skeleton className="mt-6 h-6 w-20 rounded-sm" />
        <Skeleton className="mt-2 h-5 w-36 rounded-sm" />
      </div>

      <div>
        <Skeleton className="mt-6 h-4 w-28 rounded-sm" />
        <Skeleton className="mt-2 h-4 w-40 rounded-sm" />
      </div>
    </div>
  );
};
