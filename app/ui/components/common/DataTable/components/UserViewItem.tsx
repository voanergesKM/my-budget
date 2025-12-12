import React from "react";

import { PublicUser } from "@/app/lib/definitions";
import { getuserAvatarFallback } from "@/app/lib/utils/getuserAvatarFallback";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

type Props = {
  user: PublicUser;
};

export function UserViewItem({ user }: Props) {
  return (
    <ShowcaseItem<PublicUser>
      data={user}
      titleExpression={(user) => `${user.firstName} ${user.lastName}`}
      fallbackExpression={(user) => getuserAvatarFallback(user)}
      avatarExpression={(user) => user.avatarURL || "/image-placeholder.avif"}
    />
  );
}
