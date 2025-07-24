import { Group } from "@/app/lib/definitions";

export async function createGroup(payload: Omit<Group, "_id">) {
  const response = await fetch("/api/group", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create group");
  }

  return data;
}
