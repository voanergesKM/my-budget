import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";
import { PageTitle } from "@/app/ui/components/PageTitle";
import UserProfileForm from "@/app/ui/container/UserProfileForm";
import { Suspense } from "react";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const userData = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    avatarURL: currentUser.avatarURL,
    email: currentUser.email,
  };

  return (
    <div className="px-8">
      <PageTitle title="My Profile" />

      <Suspense>
        <UserProfileForm userData={userData} />
      </Suspense>
    </div>
  );
}
