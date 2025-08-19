"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { PowerIcon } from "@heroicons/react/24/outline";

import { Button } from "../shadcn/Button";

export default function SignOut() {
  const t = useTranslations("Common.buttons");

  return (
    <form
      action={async () => {
        await signOut({ redirectTo: "/" });
      }}
      className="w-full"
    >
      <Button className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-[18px] transition hover:bg-red-500 hover:text-white">
        <PowerIcon />
        <span>{t("signOut")}</span>
      </Button>
    </form>
  );
}
