import Link from "next/link";

import HeaderSearch from "@/app/ui/components/common/Search";
import { LanguageSwitcher } from "@/app/ui/components/LanguageSwitcher";

import { auth } from "@/auth";

import { BurgerMenu } from "./BurgerMenu";
import UserAvatar from "./UserAvatar";

export default async function Header() {
  const session = await auth();

  if (!session) {
    return (
      <header className="fixed top-0 flex w-full justify-between px-6 py-4">
        <Link href="/">
          <h1 className="text-2xl font-bold text-text-primary">My Budget</h1>
        </Link>
        <LanguageSwitcher />
      </header>
    );
  }

  return (
    <header className="fixed top-0 z-50 h-[72px] w-full bg-primary shadow-md">
      <div className="max-w-screen-3xl mx-auto flex items-center gap-3 px-4 py-4 md:gap-4 md:px-6">
        <BurgerMenu />

        <HeaderSearch />
        <UserAvatar />
      </div>
    </header>
  );
}
