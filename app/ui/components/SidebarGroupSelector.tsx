"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { Group } from "@/app/lib/definitions";
import { getOptimizedAvatar } from "@/app/lib/utils/getOptimizedAvatar";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import { Avatar, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";
import { Separator } from "@/app/ui/shadcn/Separator";
import { useSidebar } from "@/app/ui/shadcn/Sidebar";

import CircularProgress from "@/app/ui/components/CircularProgress";

function SidebarGroupSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get("groupId");

  const t = useTranslations("Sidebar");

  const { isMobile, setOpenMobile } = useSidebar();

  const [open, setopen] = useState(false);

  const { data: userGroups, isLoading } = useQuery({
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

    setopen(false);

    router.push(`?${params.toString()}`);
  };

  const currentGroup =
    (userGroups && userGroups.find((g) => g._id === currentGroupId)) ?? null;

  return (
    <div className="mb-4">
      <Popover open={open} onOpenChange={setopen}>
        <PopoverTrigger asChild>
          <Button
            className="w-full items-center justify-start px-4"
            onClick={() => setopen(!open)}
            size={"lg"}
            isLoading={isLoading}
          >
            {currentGroup ? (
              <Avatar>
                <AvatarImage
                  className="rounded-full object-cover"
                  src={
                    currentGroup.image
                      ? getOptimizedAvatar(currentGroup.image, 40)
                      : "/image-placeholder.avif"
                  }
                  alt={"Group avatar"}
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Avatar>
            ) : isLoading ? (
              <CircularProgress size={100} />
            ) : (
              <Users className="!h-6 !w-6" />
            )}

            <span className="overflow-hidden truncate text-ellipsis text-nowrap">
              {currentGroup ? currentGroup.name : t("personalWorkspace")}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="flex w-[300px] flex-col gap-2 px-2 py-4 text-text-primary"
          align="start"
        >
          <Button
            onClick={() => handleSelect(null)}
            className="flex items-center justify-start gap-2 border-none bg-transparent text-text-primary"
            variant={"outline"}
          >
            <Users className="!h-6 !w-6" />
            {t("personalWorkspace")}
          </Button>

          <Separator className="my-2" />

          {!!userGroups?.length &&
            userGroups.map((g: Group) => (
              <Button
                key={g._id}
                onClick={() => handleSelect(g._id)}
                aria-label={g.name}
                className="flex items-center justify-start gap-2 border-none bg-transparent text-text-primary"
                variant={"outline"}
              >
                <Avatar className="!h-8 !w-8">
                  <AvatarImage
                    className="rounded-full object-cover"
                    src={
                      g.image
                        ? getOptimizedAvatar(g.image, 40)
                        : "/image-placeholder.avif"
                    }
                  />
                </Avatar>
                {g.name}
              </Button>
            ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SidebarGroupSelector;
