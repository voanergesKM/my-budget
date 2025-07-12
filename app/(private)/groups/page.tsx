"use client";

import { Group } from "@/app/lib/definitions";

import { useFetchGroups } from "@/app/lib/hooks/useFetchGroups";

import { PageTitle } from "@/app/ui/components/PageTitle";

export default function Groups(props: any) {
  const { data, error } = useFetchGroups();

  if (error) return <h1>Error: {error.message}</h1>;
  if (!data) return null;

  return (
    <>
      <PageTitle />

      {data!.map((group: Group) => (
        <div key={group._id}>{group.name}</div>
      ))}
    </>
  );
}
