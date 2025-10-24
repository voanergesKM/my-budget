import { Transaction } from "@/app/lib/definitions";

export const sendCreateTransaction = async (
  payload: Partial<Transaction>[],
  groupId: string | null
) => {
  const response = await fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify({ transactions: payload, groupId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
