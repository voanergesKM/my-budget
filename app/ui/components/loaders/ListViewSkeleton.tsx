import { Skeleton } from "@/app/ui/shadcn/Skeleton";

function ListViewSkeletonItem() {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-md border px-4 py-3">
      <div className="ml-6 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[100px] rounded-full" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

export const ListViewSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(10)].map((_, i) => (
        <ListViewSkeletonItem key={i} />
      ))}
    </div>
  );
};
