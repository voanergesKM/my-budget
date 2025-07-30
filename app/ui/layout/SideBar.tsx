"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  GroupIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/app/ui/shadcn/Sidebar";

import Button from "@/app/ui/components/Button";
import SidebarGroupSelector from "@/app/ui/components/SidebarGroupSelector";

const items = [
  // { title: "Home", url: "/", icon: HomeIcon },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    sharedGroup: true,
  },
  { title: "Groups", url: "/groups", icon: UserGroupIcon },
  // { title: "Categories", url: "/categories", icon: GroupIcon },
  {
    title: "Shoppings List",
    url: "/shoppings",
    icon: ShoppingCartIcon,
    sharedGroup: true,
  },
];

export default function SideBar() {
  const session = useSession();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || undefined;

  const { isMobile, setOpenMobile } = useSidebar();

  if (!session.data) {
    return null;
  }

  return (
    <div className={"fixed left-0 top-[72px] h-[100%]"}>
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
                    <SidebarMenuItem
                      key={title}
                      onClick={(props) => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Button
                        href={href}
                        startIcon={<LinkIcon className="w-6" />}
                        classes={{
                          root: cn("flex justify-start"),
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
