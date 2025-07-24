import Notify from "@/app/lib/utils/notify";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

export async function deleteGroupMember(
  memberId: string,
  origin: "pending" | "member",
  groupId: string
) {
  const response = await fetch(
    `/api/group/member?memberId=${memberId}&origin=${origin}&groupId=${groupId}`,
    {
      method: "DELETE",
    }
  );

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
