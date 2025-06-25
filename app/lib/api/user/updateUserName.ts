export const updateUserName = async (_prevState: any, formData: FormData) => {
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  return json;
};
