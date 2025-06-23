'use client';

import { useFetchGroups } from '../lib/hooks/useFetchGroups';
import { Group } from '../lib/definitions';
import { PageTitle } from '../ui/components/PageTitle';

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
