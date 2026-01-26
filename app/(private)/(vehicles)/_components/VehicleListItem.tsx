import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Edit2, Trash2Icon } from "lucide-react";

import { getOptimizedAvatar } from "@/app/lib/utils/getOptimizedAvatar";

import { Avatar, AvatarImage } from "@/app/ui/shadcn/Avatar";
import { Button } from "@/app/ui/shadcn/Button";
import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/Card";

import { Vehicle } from "@/app/lib/types/vehicle";

function VehicleListItem({
  vehicle,
  setDeleteData,
}: {
  vehicle: Vehicle;
  setDeleteData: (vehicle: Vehicle) => void;
}) {
  const router = useRouter();

  const t = useTranslations("Vehicles");
  const tv = useTranslations("VehicleTypes");
  const tf = useTranslations("FuelTypes");

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    router.push(`vehicles/update/${vehicle._id}`);
  };

  return (
    <Card
      className={"flex cursor-pointer flex-col items-center text-text-primary"}
      onClick={() => router.push(`vehicles/${vehicle._id}`)}
    >
      <CardHeader className={"relative w-full items-center"}>
        <div className="absolute right-2 top-2 z-20 ml-auto flex gap-2">
          <Button
            onClick={handleEdit}
            size={"icon"}
            variant={"ghost"}
            className="rounded-full"
            aria-label="Edit vehicle"
          >
            <Edit2 />
          </Button>

          <Button
            size={"icon"}
            variant={"ghost"}
            className="rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              setDeleteData(vehicle);
            }}
            // disabled={
            //   currentUser?.id !== group.createdBy?._id &&
            //   (currentUser as any).role !== "admin"
            // }
            aria-label="Delete vehicle"
          >
            <Trash2Icon />
          </Button>
        </div>

        <Avatar className="h-[250px] w-[250px]">
          <AvatarImage
            className="rounded-full object-cover"
            loading={"lazy"}
            src={
              vehicle.imageSrc
                ? getOptimizedAvatar(vehicle.imageSrc, 800)
                : "/image-placeholder.avif"
            }
            alt={vehicle.name}
            sizes="100px"
          />
        </Avatar>

        <div></div>
        <p>{vehicle.name}</p>
        {/*<p>{vehicle.description}</p>*/}

        <p>
          <span>{tv(vehicle.type)}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {vehicle.type === "car" && (
          <>
            {vehicle.fuelType && (
              <p>
                <span>{tf(vehicle.fuelType)}</span>
              </p>
            )}
            {vehicle.currentOdometer && (
              <p>
                {t("currentOdometer")}:<span>{vehicle.currentOdometer}</span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default VehicleListItem;
