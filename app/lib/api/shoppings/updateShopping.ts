import { ForbiddenError } from "@/app/lib/errors/customErrors";
import Notify from "@/app/lib/utils/notify";

export async function updateShopping(payload: {}) {
  console.log(payload);
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
