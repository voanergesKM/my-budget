"use client";

import SideBar from "@/app/ui/layout/SideBar";
import { cn } from "@/app/lib/utils/utils";
import { useSidebar } from "@/app/ui/shadcn/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile, open } = useSidebar();

  return (
    <div className="mx-auto min-h-dvh w-full max-w-screen-2xl pb-6 pt-[72px]">
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
