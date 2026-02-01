import React from "react";

import { getOptimizedAvatar } from "@/app/lib/utils/getOptimizedAvatar";

import { Avatar, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/Card";

import { Vehicle } from "@/app/lib/types/vehicle";

function VehicleHeader({ vehicleData }: { vehicleData: Vehicle }) {
  return (
    <Card className={"flex w-fit flex-col md:flex-row"}>
      <CardHeader>
        <Avatar className="md:h60 h-auto w-full md:w-60">
          <AvatarImage
            // className="object-contain"
            loading={"lazy"}
            src={
              vehicleData.imageSrc
                ? getOptimizedAvatar(vehicleData.imageSrc, 800)
                : "/image-placeholder.avif"
            }
            alt={vehicleData.name}
            sizes="100px"
          />
        </Avatar>
      </CardHeader>

      <CardContent className={"p-4"}>
        {vehicleData.name}

        <div>current odometer: {vehicleData.currentOdometer}</div>

        {/*<ImportBackupDialog vehicleData={vehicleData} />*/}
      </CardContent>
    </Card>
  );
}

export default VehicleHeader;
