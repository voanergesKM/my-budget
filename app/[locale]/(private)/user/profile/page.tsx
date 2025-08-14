import { Metadata } from "next";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";

import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";

import PageTitleClient from "@/app/ui/components/PageTitleClient";
import UserProfileClient from "@/app/ui/components/UserProfileClient";

export const metadata: Metadata = {
  title: buildPageTitle("My Profile"),
  description:
    "User profile page. Here you can manage your profile and settings.",
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const userData = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    avatarURL: currentUser.avatarURL,
    email: currentUser.email,
    defaultCurrency: currentUser.defaultCurrency,
  };

  return (
    <div className="px-8">
      <PageTitleClient title="My Profile" />

      <UserProfileClient userData={userData} />
    </div>
  );
}
