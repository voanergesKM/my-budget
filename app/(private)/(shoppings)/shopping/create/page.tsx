import { Suspense } from "react";
import { Metadata } from "next";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";

import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";

import ShoppingForm from "../../_components/ShoppingForm";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { groupId } = await searchParams;
  const groupName = await getGroupNameById(groupId);

  return {
    title: buildPageTitle("Shoppings list", groupName),
    description: `Create new shopping list.`,
  };
}

export default async function ShoppingCreate() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ShoppingForm />
      </Suspense>
    </>
  );
}
