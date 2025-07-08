export async function updateShopping(payload: {}) {
  const response = await fetch("/api/shoppings", { method: "POST", body: JSON.stringify(payload) });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create shopping list");
  }

  return data;
}
