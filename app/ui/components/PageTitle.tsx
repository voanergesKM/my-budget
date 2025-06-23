"use client";

import { usePathname } from "next/navigation";

type PageTitleMap = {
  [key: string]: string;
};

const pagesMap: PageTitleMap = {
  dashboard: "Dashboard",
  groups: "My Groups",
};

type PageTitleProps = {
  title?: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
  const pathName = usePathname();

  const pageTitle = title || getPageTitle(pathName.split("/")[1]);

  return (
    <h1 className="text-2xl font-bold text-text-primary mt-6 text-center">
      {pageTitle}
    </h1>
  );
};

const getPageTitle = (path: string): string => {
  return pagesMap[path] || "Default Title";
};
