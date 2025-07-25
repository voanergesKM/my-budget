"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { Group } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";

function SidebarGroupSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get("groupId");

  const { data: userGroups } = useQuery({
    queryKey: [QueryKeys.groupsList],
    queryFn: getUserGroups,
  });

  const handleSelect = (groupId?: string) => {
    const params = new URLSearchParams();

    if (groupId) {
      params.set("groupId", groupId);
    } else {
      params.delete("groupId");
    }
    router.push(`?${params.toString()}`);
  };

  const currentLabel =
    (userGroups && userGroups.find((g) => g._id === currentGroupId)?.name) ??
    "My Personal Space";

  return (
    <div className="mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center gap-4 rounded-md bg-[var(--button-bg)] px-3 py-3 text-left text-base text-[var(--button-text)] shadow-md hover:bg-[var(--button-hover-bg)] hover:shadow-lg">
          <Users />

          <span className="overflow-hidden truncate text-ellipsis text-nowrap">
            {currentLabel}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuItem onClick={() => handleSelect(undefined)}>
            My Personal Space
          </DropdownMenuItem>
          {!!userGroups?.length &&
            userGroups.map((g: Group) => (
              <DropdownMenuItem key={g._id} onClick={() => handleSelect(g._id)}>
                {g.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SidebarGroupSelector;
