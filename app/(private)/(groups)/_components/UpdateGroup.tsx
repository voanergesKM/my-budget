"use client";

import React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Notify from "@/app/lib/utils/notify";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupById } from "@/app/lib/api/groups/getGroupById";

import { ForbiddenError, NotFoundError } from "@/app/lib/errors/customErrors";

import GroupFrom from "./GroupFrom";

const UpdateGroupForm = () => {
  const params = useParams();
  const { groupId } = params;

  const router = useRouter();

  const { data, error } = useQuery({
    queryKey: [QueryKeys.getCurrentGroup, groupId ?? "all"],
    queryFn: () => getGroupById(groupId as string),
  });

  React.useEffect(() => {
    if (!error) return;

    const errorMessage = (error as { message?: string })?.message;

    Notify.error(errorMessage || "Something went wrong");
    if (error instanceof ForbiddenError) {
      router.push("/forbidden");
    }

    if (error instanceof NotFoundError) {
      notFound();
    }
  }, [error, router]);

  if (!data) {
    return null;
  }

  return <GroupFrom initialData={data.data} />;
};

export default UpdateGroupForm;
