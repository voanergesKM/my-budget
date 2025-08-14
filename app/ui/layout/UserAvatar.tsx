"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { PublicUser } from "@/app/lib/definitions";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";

import SignOut from "@/app/ui/components/SignOut";

export default function UserAvatarClient() {
  const { data: session } = useSession();
  const user = session?.user as PublicUser | undefined;

  if (!user) return null;

  const avatarFallback =
    (user?.firstName?.[0]?.toUpperCase() || "") +
    (user?.lastName?.[0]?.toUpperCase() || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={user?.avatarURL || ""} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px] border-none bg-secondary px-4 py-2 text-text-primary shadow-xl">
        <DropdownMenuLabel className="text-center text-xl">
          Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-4" />
        <DropdownMenuItem className="text-md">
          <Link href="/user/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-4" />
        <DropdownMenuItem className="m-0 w-full justify-center p-0 focus:bg-transparent">
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
