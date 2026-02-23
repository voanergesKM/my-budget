import React from "react";
import { useTranslations } from "next-intl";

import { formatWithTime } from "@/app/lib/utils/dateUtils";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

import { ServiceRecordType } from "@/app/lib/types/vehicle";

function ServiceRecordPopover({ data }: { data: ServiceRecordType }) {
  const t = useTranslations("Table");

  const amount = getFormattedAmount(data.currency, data.amount);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"ghost"}>
            <span>{formatWithTime(data.createdAt)}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-fit max-w-[200px] space-y-1 text-sm text-text-secondary">
          <p className="font-bold">{t("title")}:</p>
          <span>{data.title}</span>

          {data.notes && (
            <>
              <p className="font-bold">{t("notes")}:</p>
              <span>{data.notes}</span>
            </>
          )}

          <p className="font-bold">{t("odometer")}:</p>
          <span>{data.odometer}</span>

          <p className="font-bold">{t("amount")}:</p>
          <span>{amount}</span>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ServiceRecordPopover;
