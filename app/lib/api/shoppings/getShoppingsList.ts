import { Shopping } from "../../definitions";

export const getShoppingsList = async (groupId?: string): Promise<Shopping[]> => {
  const query = groupId ? `?groupId=${groupId}` : "";
  const res = await fetch(`/api/shoppings${query}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch shopping list");
  }

  return data?.data || [];
};
