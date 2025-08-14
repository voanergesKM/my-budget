"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bars3Icon } from "@heroicons/react/24/outline";

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
import { useSidebar } from "@/app/ui/shadcn/Sidebar";

import SignOut from "@/app/ui/components/SignOut";

import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 z-50 h-[72px] w-full bg-primary shadow-md">
      <div className="max-w-screen-3xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Burger Menu Button */}
        <button className="text-text-primary md:hidden" onClick={toggleSidebar}>
          <Bars3Icon className="h-8 w-8" />
        </button>

        <span className="text-2xl font-bold text-text-primary">My Budget</span>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}

const UserAvatar = () => {
  const { data: session } = useSession();

  const user = session?.user as PublicUser | undefined;

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
};
