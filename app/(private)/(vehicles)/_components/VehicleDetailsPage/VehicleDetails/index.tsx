import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/DropdownMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

import ConfirmationDialog from "@/app/ui/components/common/ConfirmationDialog";

import RecordDialog from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/RecordDialog";
import FuelRecordsList from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/FuelRecordsList";
import ScheduleRecordsList from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/ScheduleRecordsList";
import ServiceRecordsList from "@/app/(private)/(vehicles)/_components/VehicleDetailsPage/VehicleDetails/ServiceRecordsList";
import { useDeleteRecordMutation } from "@/app/(private)/(vehicles)/_hooks/useDeleteRecordMutation";
import {
  FuelRecordType,
  ScheduleRecordType,
  ServiceRecordType,
  Vehicle,
} from "@/app/lib/types/vehicle";

const vehicleTypeTabs = {
  car: ["fuel", "service", "schedule"],
  bicycle: ["dashboard"],
};

function VehicleDetails({ vehicleData }: { vehicleData: Vehicle }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("Vehicles");

  const [deleteData, setDeleteData] = useState<
    FuelRecordType | ServiceRecordType | ScheduleRecordType | null
  >(null);
  const [recordData, setRecordData] = useState<
    FuelRecordType | ServiceRecordType | ScheduleRecordType | null
  >(null);

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
        return (
          <ServiceRecordsList onDelete={setDeleteData} onEdit={setRecordData} />
        );

      case "schedule":
        return (
          <ScheduleRecordsList
            onDelete={setDeleteData}
            onEdit={setRecordData}
          />
        );

      default:
        return null;
    }
  }, [currentTab]);

  const tabs = vehicleTypeTabs[vehicleData.type];

  const confirmationQuestion = t("deleteRecordMessage");

  return (
    <div className="-mt-6">
      <Tabs value={currentTab} onValueChange={onValueChange}>
        <div className="sticky top-[68px] z-10 m-0 mx-[-16px] flex justify-between px-4 pt-4 backdrop-blur-md md:pt-6">
          {currentTab === "dashboard" && <div />}
          {currentTab !== "dashboard" && (
            <RecordDialog
              type={currentTab as "fuel" | "service" | "schedule"}
              vehicle={vehicleData}
              recordData={recordData}
              setRecordData={setRecordData}
            />
          )}

          <TabsList className="mb-4 ml-auto overflow-hidden bg-transparent">
            <TabsTrigger value={"dashboard"}>{t("dashboard")}</TabsTrigger>

            <div className={"hidden md:block"}>
              {tabs.map((tab) => {
                return (
                  <TabsTrigger key={tab} value={tab}>
                    {t(tab)}
                  </TabsTrigger>
                );
              })}
            </div>

            <MobileExpenses tabs={tabs} />
          </TabsList>
        </div>

        <TabsContent value={currentTab}>{tabsContent}</TabsContent>
      </Tabs>

      <ConfirmationDialog<
        FuelRecordType | ServiceRecordType | ScheduleRecordType
      >
        open={Boolean(deleteData)}
        onClose={() => setDeleteData(null)}
        confirmationQusestion={confirmationQuestion}
        onDecision={async () => {
          if (!deleteData) return;

          let transactionId = null;

          if ("transaction" in deleteData) {
            transactionId =
              typeof deleteData!.transaction === "string"
                ? deleteData!.transaction
                : deleteData!.transaction?._id || null;
          }

          await deleteRecord({
            deletedRecords: [
              {
                recordId: deleteData!._id,
                transactionId: transactionId,
              },
            ],
            type: currentTab as "fuel" | "service" | "dashboard",
            vehicleId: vehicleData._id,
          });
        }}
        loading={deleteRecordPending}
      />
    </div>
  );
}

export default VehicleDetails;

const MobileExpenses = ({ tabs }: { tabs: string[] }) => {
  const t = useTranslations("Vehicles");
  const router = useRouter();

  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") ?? "dashboard";

  const getLabel = () => {
    return currentTab === "dashboard" ? t("expenses") : t(currentTab);
  };

  const buttonVariant = currentTab !== "dashboard" ? "default" : "ghost";

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild className={"md:hidden"}>
        <Button
          variant={buttonVariant}
          className={cn(
            "text-sm text-foreground",
            buttonVariant === "ghost" && "text-text-primary"
          )}
        >
          {getLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {tabs.map((tab) => (
          <DropdownMenuItem
            key={tab}
            onSelect={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("tab", tab);

              router.replace(`?${params.toString()}`, { scroll: false });
            }}
          >
            {t(tab)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
