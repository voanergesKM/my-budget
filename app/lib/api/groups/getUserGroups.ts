import { Group } from "@/app/lib/definitions";

export const getUserGroups = async (): Promise<Array<Group>> => {
  const response = await fetch("/api/groups");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch groups");
  }

  return data.data;
};
