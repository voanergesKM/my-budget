"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { Group } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import { Avatar, AvatarImage } from "@/app/ui/shadcn/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";
import { useSidebar } from "@/app/ui/shadcn/Sidebar";

function SidebarGroupSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get("groupId");

  const { isMobile, setOpenMobile } = useSidebar();

  const { data: userGroups } = useQuery({
    queryKey: [QueryKeys.groupsList],
    queryFn: getUserGroups,
  });

  const handleSelect = (groupId: string | null) => {
    const params = new URLSearchParams();

    if (groupId) {
      params.set("groupId", groupId);
    } else {
      params.delete("groupId");
    }

    if (isMobile) {
      setOpenMobile(false);
    }

    router.push(`?${params.toString()}`);
  };

  const currentGroup =
    (userGroups && userGroups.find((g) => g._id === currentGroupId)) ?? null;

  return (
    <div className="mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-[50px] w-full items-center gap-4 rounded-md bg-[var(--button-bg)] px-3 py-3 text-left text-base text-[var(--button-text)] shadow-md hover:bg-[var(--button-hover-bg)] hover:shadow-lg">
          {currentGroup ? (
            <Avatar>
              <AvatarImage
                src={currentGroup.image || "/image-placeholder.avif"}
              />
            </Avatar>
          ) : (
            <Users />
          )}

          <span className="overflow-hidden truncate text-ellipsis text-nowrap">
            {currentGroup ? currentGroup.name : "My Personal Space"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] border-none bg-secondary px-4 py-2 text-text-primary shadow-xl">
          <DropdownMenuItem
            onClick={() => handleSelect(null)}
            className="text-md whitespace-normal break-all pl-3"
          >
            <Users className="mr-1 !h-8 !w-8" />
            My Personal Space
          </DropdownMenuItem>
          {!!userGroups?.length &&
            userGroups.map((g: Group) => (
              <DropdownMenuItem
                className="text-md whitespace-normal break-all"
                key={g._id}
                onClick={() => handleSelect(g._id)}
              >
                <Avatar>
                  <AvatarImage src={g.image || "/image-placeholder.avif"} />
                </Avatar>
                {g.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SidebarGroupSelector;
