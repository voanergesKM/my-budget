import { Metadata } from "next";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";

import PageTitle from "@/app/ui/components/PageTitle";

import UserProfileForm from "./_components/UserProfileForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await withServerTranslations("UserProfile");

  return {
    title: buildPageTitle(t("pageTitle")),
    description: t("description"),
  };
}

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  const t = await withServerTranslations("UserProfile");

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
