import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUserGroups } from "@/app/lib/api/groups/getUserGroups";

import { PageTitle } from "@/app/ui/components/PageTitle";

import GroupsList from "../_components/GroupsList";

export default async function Groups() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.groupsList],
    queryFn: getUserGroups,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <PageTitle />

      <HydrationBoundary state={dehydratedState}>
        <GroupsList />
      </HydrationBoundary>
    </>
  );
}
