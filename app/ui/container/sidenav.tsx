// import NavLinks from "@/app/ui/dashboard/nav-links";

import NavLinks from "../components/nav-links";

export default function SideNav() {
  return (
    <div className="hidden md:block md:w-64 flex h-full flex-col">
      <div className="bg-primary h-full flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 p-4">
        <NavLinks />
      </div>
    </div>
  );
}
