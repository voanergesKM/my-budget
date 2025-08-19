"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PublicUser } from "@/app/lib/definitions";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";
import { Separator } from "@/app/ui/shadcn/Separator";

import SignOut from "@/app/ui/components/SignOut";

export default function UserAvatar() {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  const t = useTranslations("UserMenu");

  const user = session?.user as PublicUser | undefined;

  const avatarFallback =
    (user?.firstName?.[0]?.toUpperCase() || "") +
    (user?.lastName?.[0]?.toUpperCase() || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 p-0 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={user?.avatarURL || ""} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="flex w-[200px] flex-col gap-2"
        align="end"
        sideOffset={10}
      >
        <Button
          variant="link"
          href="/user/profile"
          onClick={() => setOpen(false)}
          className="justify-start !bg-transparent p-0 text-lg text-text-primary hover:bg-transparent"
        >
          {t("profile")}
        </Button>

        <Separator />

        <SignOut />
      </PopoverContent>
    </Popover>
  );
}
