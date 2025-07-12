import Notify from "@/app/lib/utils/notify";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

export async function getShoppingById(id: string) {
  const response = await fetch(`/api/shoppings/?id=${id}`);
  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    if (response.status === 403) {
      throw new ForbiddenError();
    }
    throw new Error(data.message || "Failed to fetch shopping list");
  }

  return data;
}

export default getShoppingById;
