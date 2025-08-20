import { Skeleton } from "@/app/ui/shadcn/Skeleton";

function TableRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="px-4 py-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-28" />
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16" />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-28" />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </td>

      <td className="px-4 py-3">
        <Skeleton className="h-4 w-28" />
      </td>

      <td className="px-4 py-3 pr-8 text-right">
        <Skeleton className="ml-auto h-6 w-6 rounded-full" />
      </td>
    </tr>
  );
}

export function TableViewSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {[...Array(8)].map((_, i, arr) => (
              <th
                key={i}
                align={i === arr.length - 1 ? "right" : "left"}
                className="px-4 py-4"
              >
                <Skeleton className="h-4 w-28" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
