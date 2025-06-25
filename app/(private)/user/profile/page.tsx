import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";
import { PageTitle } from "@/app/ui/components/PageTitle";
import UserProfileForm from "@/app/ui/container/UserProfileForm";
import { Suspense } from "react";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="px-8">
      <PageTitle title="My Profile" />

      <Suspense>
        <UserProfileForm currentUser={currentUser} />
      </Suspense>
    </div>
  );
}
