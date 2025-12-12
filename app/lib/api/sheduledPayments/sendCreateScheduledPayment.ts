import { ApiResponse, ScheduledPaymentType } from "@/app/lib/types";

export const sendCreateScheduledPayment = async (
  payload: Partial<ScheduledPaymentType>,
  group: string | null
): Promise<ApiResponse<ScheduledPaymentType>> => {
  const response = await fetch("/api/scheduled-payment", {
    method: "POST",
    body: JSON.stringify({ ...payload, group }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
