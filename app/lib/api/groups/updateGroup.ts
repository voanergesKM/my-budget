import { Group } from "@/app/lib/definitions";
import Notify from "@/app/lib/utils/notify";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

export async function updateGroup(id: string, payload: Omit<Group, "_id">) {
  const response = await fetch(`/api/group?id=${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    Notify.error(data.message);

    if (response.status === 403) {
      throw new ForbiddenError();
    }
    throw new Error(data.message || "Failed to delete group");
  }

  return data;
}
