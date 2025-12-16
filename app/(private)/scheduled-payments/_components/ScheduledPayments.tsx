"use client";

import React, { useState } from "react";

import { ScheduledPaymentType } from "@/app/lib/types";
import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useScheduledPaymentsList } from "../hooks/useScheduledPaymentsList";

import ScheduledPaymentsList from "./ScheduledPaymentsList";
import SchedulePaymentDialog from "./SchedulePaymentDialog";

function ScheduledPayments() {
  const { data, isLoading } = useScheduledPaymentsList();

  const [dialogData, setDialogData] = useState<ScheduledPaymentType | boolean>(
    false
  );

  const onOpenDialogChange = () => {
    setDialogData((prev) => !prev);
  };

  return (
    <div className="mt-4">
      <SchedulePaymentDialog
        open={!!dialogData}
        data={dialogData}
        onOpenChange={onOpenDialogChange}
      />

      <ScheduledPaymentsList
        data={data?.data}
        isLoading={isLoading}
        setDialogData={setDialogData}
      />
    </div>
  );
}

const ScheduledPaymentsWithContext = withUserAndGroupContext(ScheduledPayments);

export default ScheduledPaymentsWithContext;
