import React, { Suspense } from "react";
import { Metadata } from "next";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";

import GroupForm from "../../_components/GroupForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: buildPageTitle("Create Group"),
    description: "Create a new group.",
  };
}

export default async function CreateGroupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroupForm />
    </Suspense>
  );
}
