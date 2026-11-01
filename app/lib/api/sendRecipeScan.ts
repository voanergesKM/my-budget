import Notify from "@/app/lib/utils/notify";

export const sendRecipeScan = async (formData: FormData) => {
  try {
    const res = await fetch("/api/scan-receipt", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      const message =
        typeof result.error === "string"
          ? result.error
          : `Receipt scan failed (HTTP ${res.status})`;
      const requestId =
        typeof result.requestId === "string"
          ? ` (request ID: ${result.requestId})`
          : "";
      throw new Error(message + requestId);
    }
    Notify.success(result.message || "Recipe scanned successfully");
    return result.data;
  } catch (error: unknown) {
    Notify.error(
      error instanceof Error ? error.message : "Failed to scan recipe"
    );
    console.error("Upload failed:", error);
    throw error;
  }
};
