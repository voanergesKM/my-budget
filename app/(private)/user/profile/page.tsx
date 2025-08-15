import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";

import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";

import PageTitle from "@/app/ui/components/PageTitle";

import UserProfileForm from "./_components/UserProfileForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace: "UserProfile" });

  return {
    title: buildPageTitle(t("pageTitle")),
    description: t("description"),
  };
}

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace: "UserProfile" });

  if (!currentUser) return null;

  const userData = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    avatarURL: currentUser.avatarURL,
    email: currentUser.email,
    defaultCurrency: currentUser.defaultCurrency,
  };

  return (
    <div>
      <PageTitle title={t("pageTitle")} />

      <UserProfileForm userData={userData} />
    </div>
  );
}
