import Link from "next/link";

import { LanguageSwitcher } from "../components/LanguageSwitcher";

import { BurgerMenu } from "./BurgerMenu";
import UserAvatarClient from "./UserAvatar";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 h-[72px] w-full bg-primary shadow-md">
      <div className="max-w-screen-3xl mx-auto flex items-center justify-between px-6 py-4">
        <BurgerMenu />

        <Link href="/">
          <h1 className="text-2xl font-bold text-text-primary">My Budget</h1>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {/* <UserAvatarClient /> */}
        </div>
      </div>
    </header>
  );
}
