import { ListViewSkeleton } from "./ListViewSkeleton";
import { TableViewSkeleton } from "./TableViewSkeleton";

export const TableLoader = () => {
  return (
    <>
      <div className="md:hidden">
        <ListViewSkeleton />
      </div>
      <div className="hidden md:block">
        <TableViewSkeleton />
      </div>
    </>
  );
};
