import { Metadata } from "next";

import { buildPageTitle } from "@/app/lib/utils/buildPageTitle";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import VehicleForm from "@/app/(private)/(vehicles)/_components/VehicleForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await withServerTranslations("Vehicles");

  return {
    title: buildPageTitle(t("addVehiclePage")),
    description: t("addVehiclePageDescription"),
  };
}

export default async function Groups() {
  const t = await withServerTranslations("Vehicles");

  return (
    <div className={"mt-4 flex flex-col items-center"}>
      <h3 className={"text-xl text-text-primary"}>{t("addVehiclePage")}</h3>
      <VehicleForm />
    </div>
  );
}
