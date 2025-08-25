import { Transaction } from "@/app/lib/definitions";

type PaginatedResponse<T> = {
  list: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
};

export const getTransactionsList = async (
  groupId: string | null,
  origin = "outgoing",
  page = "1",
  pageSize = "10",
  from?: string | null,
  to?: string | null,
  cid?: string | null
): Promise<PaginatedResponse<Transaction>> => {
  const params = new URLSearchParams();

  params.set("origin", origin);
  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());

  if (groupId) params.set("groupId", groupId);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (cid) params.set("cid", cid);

  const res = await fetch(`/api/transactions?${params.toString()}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch shopping list");
  }

  return data.data as PaginatedResponse<Transaction>;
};
