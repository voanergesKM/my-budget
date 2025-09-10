import React, { Suspense } from "react";
import { Metadata } from "next";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { GroupFormSkeleton } from "@/app/ui/components/loaders/GroupFormSkeleton";

import GroupForm from "../../_components/GroupForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await withServerTranslations("Groups");

  return {
    title: buildPageTitle(t("createGroup")),
    description: "Create a new group.",
  };
}

export default async function CreateGroupPage() {
  return (
    <Suspense fallback={<GroupFormSkeleton />}>
      <GroupForm />
    </Suspense>
  );
}
