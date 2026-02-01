import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { getVehiclesList } from "@/app/lib/api/vehicle/getVehiclesList";

import VehiclesList from "@/app/(private)/(vehicles)/_components/VehiclesList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await withServerTranslations("Vehicles");

  return {
    title: buildPageTitle(t("pageTitle")),
    description: t("pageDescription"),
  };
}

export default async function Groups() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.vehiclesList()],
    queryFn: getVehiclesList,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VehiclesList />
    </HydrationBoundary>
  );
}
