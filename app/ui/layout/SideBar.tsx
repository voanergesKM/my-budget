"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  CalendarSyncIcon,
  GroupIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/app/ui/shadcn/Sidebar";

import SidebarGroupSelector from "@/app/ui/components/SidebarGroupSelector";

import { VehicleIcon } from "@/app/ui/icons/";

const items = [
  { titleKey: "home", url: "/", icon: HomeIcon, sharedGroup: true },
  {
    titleKey: "dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    sharedGroup: true,
  },
  {
    titleKey: "scheduledPayments",
    url: "/scheduled-payments",
    icon: CalendarSyncIcon,
    sharedGroup: true,
  },
  { titleKey: "groups", url: "/groups", icon: UserGroupIcon },
  {
    titleKey: "categories",
    url: "/categories",
    icon: GroupIcon,
    sharedGroup: true,
  },
  {
    titleKey: "shoppingList",
    url: "/shoppings",
    icon: ShoppingCartIcon,
    sharedGroup: true,
  },
  {
    titleKey: "vehiclesList",
    url: "/vehicles",
    icon: VehicleIcon,
    sharedGroup: true,
  },
];

export default function SideBar() {
  const searchParams = useSearchParams();

  const groupId = searchParams.get("groupId") || undefined;
  const t = useTranslations("Sidebar");

  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar className="fixed border-none" variant="inset">
      <SidebarContent className="pt-4 md:pt-20">
        <SidebarGroup>
          <SidebarGroupContent className="mb-2">
            <SidebarGroupSelector />
          </SidebarGroupContent>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map(({ titleKey, url, icon: LinkIcon, sharedGroup }) => {
                const href =
                  groupId && sharedGroup ? `${url}?groupId=${groupId}` : url;

                return (
                  <SidebarMenuItem
                    key={titleKey}
                    onClick={() => isMobile && setOpenMobile(false)}
                  >
                    <Button
                      href={href}
                      className="w-full items-center justify-start text-lg"
                    >
                      <LinkIcon className="!size-6" />
                      {t(titleKey)}
                    </Button>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
