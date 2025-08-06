// app/context/group-context.tsx

"use client";

import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getGroupById } from "@/app/lib/api/groups/getGroupById";

type Group = Awaited<ReturnType<typeof getGroupById>>;

type GroupContextType = {
  groupId: string | null;
  group: Group | undefined;
  isLoading: boolean;
  isError: boolean;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.getCurrentGroup, groupId ?? "all"],
    queryFn: () =>
      groupId ? getGroupById(groupId) : Promise.resolve(undefined),
    enabled: !!groupId,
  });

  return (
    <GroupContext.Provider
      value={{
        groupId,
        group: data?.data,
        isLoading,
        isError,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useCurrentGroup = () => {
  const ctx = useContext(GroupContext);
  if (!ctx)
    throw new Error("useCurrentGroup must be used within GroupProvider");
  return ctx;
};
