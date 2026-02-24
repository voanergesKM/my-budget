import React from "react";
import { useTranslations } from "next-intl";

import { getOptimizedAvatar } from "@/app/lib/utils/getOptimizedAvatar";

import { Avatar, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/Card";

import VehicleStatsPanel from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleStatsPanel";
import { Vehicle } from "@/app/lib/types/vehicle";

function VehicleHeader({ vehicleData }: { vehicleData: Vehicle }) {
  const t = useTranslations("Table");

  return (
    <Card className={"flex w-fit flex-col lg:flex-row"}>
      <CardHeader className={"p-4 pb-2 md:pb-4"}>
        <Avatar className="md:h60 h-auto w-full md:w-60">
          <AvatarImage
            className="rounded-lg object-cover"
            loading={"lazy"}
            src={
              vehicleData.imageSrc
                ? getOptimizedAvatar(vehicleData.imageSrc, 1000)
                : "/image-placeholder.avif"
            }
            alt={vehicleData.name}
            sizes="100px"
          />
        </Avatar>
      </CardHeader>

      <CardContent
        className={
          "mt-4 flex flex-col justify-between gap-4 text-text-primary md:mt-0 md:p-4"
        }
      >
        <div>
          <p className={"mb-2 text-xl"}>{vehicleData.name}</p>

          <p className={"mb-4 text-lg"}>
            {t("currentOdometer")}: {vehicleData.currentOdometer}
          </p>

          <p className={"text-md mb-4"}>
            {t("description")}: {vehicleData.description}
          </p>
        </div>

        {vehicleData!.stats && <VehicleStatsPanel stats={vehicleData.stats} />}
      </CardContent>
    </Card>
  );
}

export default VehicleHeader;
