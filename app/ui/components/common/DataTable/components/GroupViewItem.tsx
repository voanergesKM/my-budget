import React from "react";

import { Group } from "@/app/lib/definitions";

import ShowcaseItem from "@/app/ui/components/common/ShowcaseItem";

type Props = {
  group: Group;
};

export function GroupViewItem({ group }: Props) {
  return (
    <ShowcaseItem<Group>
      data={group}
      titleExpression={(group) => group?.name}
      avatarExpression={(group) => group?.image || "/image-placeholder.avif"}
    />
  );
}
