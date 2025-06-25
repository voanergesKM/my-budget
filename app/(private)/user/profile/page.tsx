import { getCurrentUser } from "@/app/lib/api/user/getCurrentuser";
import { PageTitle } from "@/app/ui/components/PageTitle";
import Image from "next/image";

export default async function ProfilePage(req: Request) {
  const currentUser = await getCurrentUser();


  console.log("currentUser => ", currentUser);

  return (
    <div>
      <PageTitle title="My Profile" />

      <div className="mt-[20px]">
        <Image
          src={currentUser.avatarURL}
          width={150}
          height={150}
          alt="avatar"
          className="mx-auto rounded-full"
        />
      </div>
    </div>
  );
}
