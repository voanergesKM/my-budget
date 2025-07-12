"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { HomeIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/app/ui/shadcn/Sidebar";

import Button from "@/app/ui/components/Button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: HomeIcon },
  { title: "Groups", url: "/groups", icon: UserGroupIcon },
  { title: "Shoppings List", url: "/shoppings", icon: UserGroupIcon },
];

export default function SideBar() {
  return (
    <div className={"fixed top-[72px] h-[100%]"}>
      <Sidebar className="relative border-none">
        <SidebarContent className="px-2 pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {items.map(({ title, url, icon: LinkIcon }) => (
                  <SidebarMenuItem key={title}>
                    <Button
                      href={url}
                      startIcon={<LinkIcon className="w-6" />}
                      classes={{
                        root: clsx("flex  justify-start"),
                      }}
                    >
                      {title}
                    </Button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
