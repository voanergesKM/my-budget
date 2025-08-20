import { Skeleton } from "@/app/ui/shadcn/Skeleton";

export const CategoriesSkeleton = () => {
  return (
    <div className="mt-2 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(330px,1fr))]">
      {[...Array(6)].map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
};

const CategoryCardSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between gap-4 bg-card p-6 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full md:h-16 md:w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  );
};
