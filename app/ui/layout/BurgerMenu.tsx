"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";

import { useSidebar } from "../shadcn/Sidebar";

export const BurgerMenu = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button className="text-text-primary md:hidden" onClick={toggleSidebar}>
      <Bars3Icon className="h-8 w-8" />
    </button>
  );
};
