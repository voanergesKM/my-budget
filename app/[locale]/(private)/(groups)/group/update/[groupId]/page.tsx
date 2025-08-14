import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupById } from "@/app/lib/api/groups/getGroupById";
import { getGroupNameById } from "@/app/lib/api/groups/getGroupNameById";

import { ForbiddenError, NotFoundError } from "@/app/lib/errors/customErrors";

import UpdateGroupForm from "../../../_components/UpdateGroup";

type Params = Promise<{ groupId: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { groupId } = await props.params;
  const groupName = await getGroupNameById(groupId);

  return {
    title: buildPageTitle("Update Group", groupName),
    description: "Update a group.",
  };
}

export default async function UpdateGroup(props: { params: Params }) {
  const queryClient = new QueryClient();
  const { groupId } = await props.params;

  try {
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.getCurrentGroup, groupId ?? "all"],
      queryFn: () => getGroupById(groupId),
    });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      redirect("/forbidden");
    }

    if (error instanceof NotFoundError) {
      notFound();
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UpdateGroupForm />
    </HydrationBoundary>
  );
}
