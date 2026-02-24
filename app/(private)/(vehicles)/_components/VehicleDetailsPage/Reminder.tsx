import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { BellRingIcon, CalendarIcon, CarFront } from "lucide-react";

import { formatDate } from "@/app/lib/utils/dateUtils";
import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

import { StatusBadge, StatusType } from "@/app/ui/components/StatusBadge";

import { ScheduleRecordType } from "@/app/lib/types/vehicle";

function Reminder({ data }: { data: ScheduleRecordType[] }) {
  const format = useFormatter();

  const tc = useTranslations("VehicleExpenseCategory");
  const ts = useTranslations("Status");
  const tv = useTranslations("Vehicles");

  const overdue = data.filter((r) => r.status === "overdue");
  const due = data.filter((r) => r.status === "due");

  return (
    <div className="absolute -right-1 -top-1 z-10 flex items-center gap-2">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button size="icon" className="relative h-12 w-12 [&_svg]:!size-5">
            {data.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] animate-bounce items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-white">
                {data.length > 99 ? "99+" : data.length}
              </span>
            )}
            <BellRingIcon className="h-6 w-6" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="bottom"
          className="max-h-[500px] w-[360px] overflow-hidden p-0"
        >
          <div className="border-b px-4 py-3">
            <div className="text-sm font-semibold text-text-secondary">
              {tv("plannedExpenses")}
            </div>
            <div className="text-xs text-muted-foreground">
              {overdue.length > 0 && (
                <span className="font-medium text-destructive">
                  {overdue.length} {ts("overdue")}
                </span>
              )}
              {overdue.length > 0 && due.length > 0 && " • "}
              {due.length > 0 && (
                <span>
                  {due.length} {ts("due")}
                </span>
              )}
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {data.map((item) => (
              <div
                key={item._id}
                className={cn(
                  "group px-4 py-3 transition-colors",
                  item.status === "overdue" && "bg-destructive/5"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium leading-tight text-text-primary">
                    {item.title}
                  </div>
                  <StatusBadge status={item.status as StatusType} />
                </div>
                {item.category && (
                  <p className="my-2 text-xs text-muted-foreground">
                    {tc(item.category)}
                  </p>
                )}

                <div className="mt-1 flex items-center justify-between gap-2 space-y-0.5 text-sm text-muted-foreground">
                  {!!item.triggerOdometer && (
                    <div className="flex items-center gap-2">
                      <CarFront className="h-4 w-4" />
                      <span>{format.number(item.triggerOdometer)} km</span>
                    </div>
                  )}

                  {!!item.triggerDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(item.triggerDate, "full")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Reminder;
