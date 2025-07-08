"use client";

import { cn } from "@/app/lib/utils/utils";
import { usePathname } from "next/navigation";

type PageTitleMap = {
  [key: string]: string;
};

const pagesMap: PageTitleMap = {
  dashboard: "Dashboard",
  groups: "My Groups",
  shoppings: "My Shoppings",
};

type PageTitleProps = {
  title?: string;
  className?: string;
};

export const PageTitle = ({ title, className }: PageTitleProps) => {
  const pathName = usePathname();

  const pageTitle = title || getPageTitle(pathName.split("/")[1]);

  return (
    <h1 className={cn("mt-6 text-center text-2xl font-bold text-text-primary", className)}>
      {pageTitle}
    </h1>
  );
};

const getPageTitle = (path: string): string => {
  return pagesMap[path] || "Default Title";
};
