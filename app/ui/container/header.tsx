"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { PublicUser } from "@/app/lib/definitions";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user as PublicUser;

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
