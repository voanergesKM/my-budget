import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import QueryKeys from "@/app/lib/utils/queryKeys";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { getVehicleById } from "@/app/lib/api/vehicle/getVehicleById";

import VehicleDetailsPage from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage";
import { ForbiddenError } from "@/app/lib/errors/customErrors";

type Params = Promise<{ vehicleId: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { vehicleId } = await params;

  const t = await withServerTranslations("Vehicles");

  return {
    title: buildPageTitle(t("updateVehiclePageTitle")),
    description: `${t("updateVehiclePageDesc")}`,
  };
}

export default async function UpdateVehicle(props: { params: Params }) {
  const queryClient = new QueryClient();
  const { vehicleId } = await props.params;

  const t = await withServerTranslations("Vehicles");

  try {
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.vehicleById(vehicleId)],
      queryFn: () => getVehicleById(vehicleId),
    });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      redirect("/forbidden");
    }
    throw error;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={"mt-4"}>
        <VehicleDetailsPage />
      </div>
    </HydrationBoundary>
  );
}
