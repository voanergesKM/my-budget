import { ScheduledPaymentType } from "@/app/lib/types";

export const sendUpdateScheduledPayment = async (
  payload: ScheduledPaymentType
) => {
  const response = await fetch("/api/scheduled-payment", {
    method: "PATCH",
    body: JSON.stringify({ ...payload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update scheduled payment");
  }

  return data;
};
