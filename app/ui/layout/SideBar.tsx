"use client";

import { useSearchParams } from "next/navigation";
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

import SidebarGroupSelector from "../components/SidebarGroupSelector";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: HomeIcon, sharedGroup: true },
  { title: "Groups", url: "/groups", icon: UserGroupIcon },
  {
    title: "Shoppings List",
    url: "/shoppings",
    icon: UserGroupIcon,
    sharedGroup: true,
  },
];

export default function SideBar() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || undefined;

  return (
    <div className={"fixed top-[72px] h-[100%]"}>
      <Sidebar className="relative border-none">
        <SidebarContent className="px-2 pt-4">
          <SidebarGroup>
            <SidebarGroupContent className="mb-2">
              <SidebarGroupSelector />
            </SidebarGroupContent>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {items.map(({ title, url, icon: LinkIcon, sharedGroup }) => {
                  const href =
                    groupId && sharedGroup ? `${url}?groupId=${groupId}` : url;

                  return (
                    <SidebarMenuItem key={title}>
                      <Button
                        href={href}
                        startIcon={<LinkIcon className="w-6" />}
                        classes={{
                          root: clsx("flex justify-start"),
                        }}
                      >
                        {title}
                      </Button>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
