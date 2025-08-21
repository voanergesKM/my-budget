import { Skeleton } from "@/app/ui/shadcn/Skeleton";

import { GroupCardSkeleton } from "@/app/ui/components/loaders/GroupCardSkeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="my-4 h-[40px] w-36 rounded-sm" />

      <GroupCardSkeleton />
    </>
  );
}
