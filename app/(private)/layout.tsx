"use client";

import { cn } from "@/app/lib/utils/utils";

import { useSidebar } from "@/app/ui/shadcn/Sidebar";

import SideBar from "@/app/ui/layout/SideBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile, open } = useSidebar();

  return (
    <div className="max-w-screen-3xl mx-auto min-h-dvh w-full pb-6 pt-[72px]">
      <SideBar />

      <div
        className={cn("px-4 md:px-6", {
          "ml-[--sidebar-width]": !isMobile && open,
        })}
      >
        {children}
      </div>
    </div>
  );
}
