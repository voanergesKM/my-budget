import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";

import PageTitleClient from "@/app/ui/components/PageTitleClient";
import UserProfileClient from "@/app/ui/components/UserProfileClient";

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
