"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Group } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import Button from "@/app/ui/components/Button";
import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";

import { useDeleteGroupMutation } from "../_hooks/useDeleteGroupMutation";

import { GroupCard } from "./GroupCard";

const GroupsList = () => {
  const router = useRouter();

  const [deleteData, setDeleteData] = useState<Group | null>(null);

  const { data } = useQuery({
    queryKey: [QueryKeys.groupsList],
    queryFn: getUserGroups,
  });

  const { mutate, isPending } = useDeleteGroupMutation(
    [QueryKeys.groupsList],
    () => {
      setDeleteData(null);
    }
  );

  const handleCreate = () => {
    const location = "group/create";
    router.push(location);
  };

  return (
    <div>
      <div className="my-6 w-[150px]">
        <Button onClick={handleCreate}>Create Group</Button>
      </div>
      {!!data?.length && (
        <div className="flex flex-wrap gap-5">
          {data.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              setDeleteData={setDeleteData}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog<Group>
        open={Boolean(deleteData)}
        onClose={() => setDeleteData(null)}
        confirmationQusestion={`Are you sure you want to delete "${deleteData?.name}" group?`}
        loading={isPending}
        onDecision={() => {
          mutate(deleteData!._id);
        }}
      />
    </div>
  );
};

export default GroupsList;
