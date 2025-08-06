export const getUser = async () => {
  const response = await fetch("/api/users/me");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data.data;
};
