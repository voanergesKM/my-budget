"use client";

import { useState } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import SignOut from "@/app/ui/sign-out";
import { UserSession } from "@/app/lib/definitions";

export default function Header({ session }: { session: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!session) return null;

  return (
    <header className="w-full bg-primary shadow-md fixed top-0">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        {/* Burger Menu Button */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>

        <span className="text-2xl font-bold text-text-primary">My Budget</span>

        <nav className="hidden gap-10 text-text-secondary lg:flex">
          <Link href="/dashboard" className="hover:text-text-primary">
            Dashboard
          </Link>
          <Link href="/reports" className="hover:text-text-primary">
            Reports
          </Link>
          <Link href="/settings" className="hover:text-text-primary">
            Settings
          </Link>
        </nav>

        <Popover className="relative">
          <PopoverButton className="focus:outline-none">
            {session.user?.avatarURL ? (
              <Image
                src={session.user.avatarURL}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border border-secondary shadow-md cursor-pointer"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-text-primary font-bold shadow-md cursor-pointer">
                {session.user?.name
                  ? session.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </div>
            )}
          </PopoverButton>

          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <PopoverPanel
              static
              anchor="bottom"
              className="absolute right-0 mt-2 w-48 rounded-lg bg-card-bg/90 border border-secondary p-3 shadow-xl ring-1 ring-primary-shadow backdrop-blur-md"
            >
              <div className="flex flex-col gap-2 text-text-primary">
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-md hover:bg-secondary hover:text-white transition"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 rounded-md hover:bg-secondary hover:text-white transition"
                >
                  Settings
                </Link>

                <SignOut />
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
        {/* </div> */}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-primary shadow-lg py-4 flex flex-col items-center gap-4 text-text-secondary">
          <Link
            href="/dashboard"
            className="hover:text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/reports"
            className="hover:text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Reports
          </Link>
          <Link
            href="/settings"
            className="hover:text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>
        </nav>
      )}
    </header>
  );
}
