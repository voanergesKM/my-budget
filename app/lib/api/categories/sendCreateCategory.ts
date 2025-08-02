export const sendCreateCategory = async (payload: {}) => {
  const response = await fetch("/api/category", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create category");
  }

  return data;
};
