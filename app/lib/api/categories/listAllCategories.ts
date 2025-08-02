export const listAllCategories = async (
  origin: string,
  groupId?: string | null
) => {
  const params = new URLSearchParams();
  params.set("origin", origin);
  if (groupId) params.set("groupId", groupId);

  const url = `/api/categories${params.toString() ? `?${params}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};
