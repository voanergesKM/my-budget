import { Shopping } from "@/app/lib/definitions";

type PaginatedResponse<T> = {
  list: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
};

export const getShoppingsList = async (
  groupId?: string,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<Shopping>> => {
  const params = new URLSearchParams();
  if (groupId) params.set("groupId", groupId);
  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());

  const res = await fetch(`/api/shoppings?${params.toString()}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch shopping list");
  }

  return data.data as PaginatedResponse<Shopping>;
};
