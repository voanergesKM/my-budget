"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/app/ui/shadcn/Button";

import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";

import VehicleListItem from "@/app/(private)/(vehicles)/_components/VehicleListItem";
import { useDeleteVehicleMutation } from "@/app/(private)/(vehicles)/_hooks/useDeleteVehicleMutation";
import { useVehiclesList } from "@/app/(private)/(vehicles)/_hooks/useVehiclesList";
import { Vehicle } from "@/app/lib/types/vehicle";
import { AddVehicleIcon } from "@/app/ui/icons";

// import { useDeleteGroupMutation } from "../_hooks/useDeleteGroupMutation";
//
// import { GroupCard } from "./GroupCard";

const VehiclesList = () => {
  const router = useRouter();

  const t = useTranslations("Vehicles");
  const td = useTranslations("Dialogs");
  const te = useTranslations("Entities");

  const [deleteData, setDeleteData] = useState<Vehicle | null>(null);

  const { data, isLoading } = useVehiclesList();

  const { mutate: onDeleteVehicle, isPending: deletingVehicle } =
    useDeleteVehicleMutation(() => {
      setDeleteData(null);
    });

  return (
    <div>
      <div className="my-4">
        <Button href="vehicles/create">
          <AddVehicleIcon className={"!size-5"} />
          {t("addVehicle")}
        </Button>
      </div>

      {/*{isLoading && <GroupCardSkeleton />}*/}

      {data && (
        <ul
          className={
            "grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
          }
        >
          {data.data.map((vehicle) => {
            return (
              <VehicleListItem
                key={vehicle._id}
                vehicle={vehicle}
                setDeleteData={setDeleteData}
              />
            );
          })}
        </ul>
      )}

      {/*{!!data?.length && (*/}
      {/*  <div className="flex flex-wrap gap-5">*/}
      {/*    {data.map((group) => (*/}
      {/*      <GroupCard*/}
      {/*        key={group._id}*/}
      {/*        group={group}*/}
      {/*        setDeleteData={setDeleteData}*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*)}*/}

      <ConfirmationDialog<Vehicle>
        open={Boolean(deleteData)}
        onClose={() => setDeleteData(null)}
        confirmationQusestion={td("deleteVehicleMessage")}
        loading={deletingVehicle}
        onDecision={() => {
          onDeleteVehicle(deleteData!._id);
        }}
      />
    </div>
  );
};

export default VehiclesList;
