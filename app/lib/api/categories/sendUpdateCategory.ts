import { Category } from "@/app/lib/definitions";

interface Data extends Omit<Category, "group" | "createdBy"> {
  groupId: string | null;
}

export const sendUpdateCategory = async (data: Data) => {
  const res = await fetch(`/api/category`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update category");
  }

  return res.json();
};
