import { ForbiddenError, NotFoundError } from "@/app/lib/errors/customErrors";

export const getGroupById = async (id: string) => {
  if (!id) {
    throw new NotFoundError("Group id is required");
  }

  const response = await fetch(`/api/group/?id=${id}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 403) {
      throw new ForbiddenError();
    }

    if (response.status === 404) {
      throw new NotFoundError(data.message || "Group not found");
    }

    throw new Error(data.message || "Failed to fetch group");
  }

  return data;
};
