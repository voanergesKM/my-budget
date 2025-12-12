import { ApiResponse, ScheduledPaymentType } from "@/app/lib/types";

import { PaginatedResponse } from "../../definitions";

export const getScheduledPayments = async (
  groupId: string | null,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<ScheduledPaymentType>>> => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());
  if (groupId) params.set("groupId", groupId);

  const response = await fetch(`/api/scheduled-payments?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `Failed to fetch scheduled payments (${response.status}): ${errorText}`
    );
  }

  return response.json();
};
