export async function deleteScheduledPayment(ids: string[]) {
  const response = await fetch("/api/scheduled-payment", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });

  if (response.status === 204) {
    return { success: true, data: null };
  }

  let data;

  try {
    data = await response.json();
  } catch {
    data = { message: "Unknown error" };
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete scheduled payment");
  }

  return data;
}
