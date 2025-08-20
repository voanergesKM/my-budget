import { PageTabsSkeleton } from "./PageTabsSkeleton";
import { TableLoader } from "./TableLoader";

export const TabsAndTableLoader = () => {
  return (
    <div className="mt-2">
      <PageTabsSkeleton />
      <TableLoader />
    </div>
  );
};
