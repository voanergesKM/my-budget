import Notify from "@/app/lib/utils/notify";

export const sendRecipeScan = async (formData: FormData) => {
  try {
    const res = await fetch("/api/scan-receipt", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    Notify.success(result.message || "Recipe scanned successfully");
    return result.data;
  } catch (error: Error | any) {
    Notify.error(error?.message || "Failed to scan recipe");
    console.error("Upload failed:", error);
    throw error;
  }
};
