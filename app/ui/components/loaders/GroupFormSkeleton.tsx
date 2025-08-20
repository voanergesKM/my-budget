import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export function GroupFormSkeleton() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-6 w-40" />

        <Skeleton className="h-32 w-32 rounded-full md:h-[200px] md:w-[200px] xl:h-[300px] xl:w-[300px]" />

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <Skeleton className="h-10 w-40 rounded-md" />

      <div className="flex w-full justify-center gap-4">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}
