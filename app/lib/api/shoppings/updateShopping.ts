import Notify from "@/app/lib/utils/notify";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

export async function updateShopping(payload: {}) {
  const response = await fetch("/api/shoppings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);
    if (response.status === 403) {
      throw new ForbiddenError();
    }
    throw new Error(data.message || "Failed to update shopping list");
  }

  return data;
}
