import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";

import LoginForm from "../_components/LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace: "Auth.login" });

  return {
    title: buildPageTitle(t("pageTitle")),
    description: t("description"),
  };
}

export default async function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="auth-container">
        <LoginForm />
      </div>
    </div>
  );
}
