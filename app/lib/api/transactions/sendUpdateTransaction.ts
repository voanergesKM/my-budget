import { Transaction } from "@/app/lib/definitions";

export const sendUpdateTransaction = async (
  payload: Partial<Transaction>,
  groupId: string | null
) => {
  const response = await fetch("/api/transaction", {
    method: "PATCH",
    body: JSON.stringify({ ...payload, groupId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create transaction");
  }

  return data;
};
