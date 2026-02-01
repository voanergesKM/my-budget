import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";

import RecordDialog from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog";
import FuelRecordsList from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/FuelRecordsList";
import { useDeleteRecordMutation } from "@/app/(private)/(vehicles)/_hooks/useDeleteRecordMutation";
import { FuelRecordType, Vehicle } from "@/app/lib/types/vehicle";

const vehicleTypeTabs = {
  car: ["dashboard", "fuel", "service"],
  bicycle: ["dashboard"],
};

function VehicleDetails({ vehicleData }: { vehicleData: Vehicle }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("Vehicles");

  const [deleteData, setDeleteData] = useState<FuelRecordType | null>(null);
  const [recordData, setRecordData] = useState<FuelRecordType | null>(null);

  const currentTab = searchParams.get("tab") ?? "dashboard";

  const { mutateAsync: deleteRecord, isPending: deleteRecordPending } =
    useDeleteRecordMutation(vehicleData._id, currentTab, () => {
      setDeleteData(null);
    });

  const onValueChange = (value: string) => {
    const params = new URLSearchParams();

    params.set("tab", value);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const tabsContent = useMemo(() => {
    switch (currentTab) {
      case "dashboard":
        return "In development";

      case "fuel":
        return (
          <FuelRecordsList onDelete={setDeleteData} onEdit={setRecordData} />
        );

      case "service":
        return null;

      default:
        return null;
    }
  }, [currentTab]);

  const tabs = vehicleTypeTabs[vehicleData.type];

  const confirmationQuestion = getConfirmationMessage(currentTab);

  return (
    <>
      <Tabs value={currentTab} onValueChange={onValueChange}>
        <div className="sticky top-[68px] z-10 m-0 mx-[-16px] flex justify-between px-4 pt-6 backdrop-blur-md">
          {currentTab === "dashboard" && <div />}
          {(currentTab === "fuel" || currentTab === "service") && (
            <RecordDialog
              type={currentTab as "fuel" | "service"}
              vehicle={vehicleData}
              recordData={recordData}
              setRecordData={setRecordData}
            />
          )}

          <TabsList className="mb-4 bg-transparent">
            {tabs.map((tab) => {
              return (
                <TabsTrigger key={tab} value={tab}>
                  {t(tab)}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value={currentTab}>{tabsContent}</TabsContent>
      </Tabs>

      <ConfirmationDialog<FuelRecordType>
        open={Boolean(deleteData)}
        onClose={() => setDeleteData(null)}
        confirmationQusestion={confirmationQuestion}
        onDecision={async () => {
          await deleteRecord({
            deletedRecords: [
              {
                recordId: deleteData!._id,
                transactionId:
                  typeof deleteData!.transaction === "string"
                    ? deleteData!.transaction
                    : deleteData!.transaction?._id || null,
              },
            ],
            type: currentTab as "fuel" | "service" | "dashboard",
            vehicleId: vehicleData._id,
          });
        }}
        loading={deleteRecordPending}
      />
    </>
  );
}

export default VehicleDetails;

function getConfirmationMessage(tab: string) {
  const t = useTranslations("Vehicles");

  switch (tab) {
    case "fuel": {
      return t("deleteFuelRecordMessage");
    }

    case "service": {
      return t("deleteServiceRecordMessage");
    }

    default: {
      return "";
    }
  }
}
