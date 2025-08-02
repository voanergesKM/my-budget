"use client";

import dynamic from "next/dynamic";

import { PublicUser } from "@/app/lib/definitions";

const UserProfileForm = dynamic(
  () => import("@/app/ui/pages/UserProfileForm"),
  {
    ssr: false,
  }
);

export default function UserProfileClient({
  userData,
}: {
  userData: PublicUser;
}) {
  return <UserProfileForm userData={userData} />;
}
