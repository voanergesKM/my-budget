'use client';

import { Group } from "@/app/lib/definitions";
import { useFetchGroups } from "@/app/lib/hooks/useFetchGroups";
import { PageTitle } from "@/app/ui/components/PageTitle";


export default function Groups(props: any) {
  const { data, error, isLoading } = useFetchGroups();

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  return (
    <>
      <PageTitle />

      {data!.map((group: Group) => (
        <div key={group._id}>{group.name}</div>
      ))}
    </>
  );
}
