export async function deleteShoppings(ids: string[]) {
  const response = await fetch("/api/shoppings", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete shopping list");
  }

  return data;
}
