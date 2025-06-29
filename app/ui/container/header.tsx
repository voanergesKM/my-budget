"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { PublicUser } from "@/app/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/components/DropdownMenu";
import SignOut from "@/app/ui/components/sign-out";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = useSession();

  if (!session) return null;

  return (
    <header className="fixed top-0 w-full bg-primary shadow-md">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        {/* Burger Menu Button */}
        <button className="text-text-primary md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
        </button>

        <span className="text-2xl font-bold text-text-primary">My Budget</span>

        <UserAvatar />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="absolute left-0 top-full flex w-full flex-col items-center gap-4 bg-primary py-4 text-text-secondary shadow-lg md:hidden">
          <Link
            href="/dashboard"
            className="hover:text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/groups"
            className="hover:text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Reports
          </Link>
        </nav>
      )}
    </header>
  );
}

const UserAvatar = () => {
  const { data: session } = useSession();

  const user = session?.user as PublicUser | undefined;

  const avatarFallback =
    (user?.firstName?.[0]?.toUpperCase() || "") + (user?.lastName?.[0]?.toUpperCase() || "");

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={user.avatarURL || ""} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px] border-none bg-secondary px-4 py-2 text-text-primary shadow-xl">
        <DropdownMenuLabel className="text-center text-xl">Settings</DropdownMenuLabel>
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
