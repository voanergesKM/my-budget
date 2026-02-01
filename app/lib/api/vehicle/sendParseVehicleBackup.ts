import Notify from "@/app/lib/utils/notify";

export const sendParseVehicleBackup = async (formData: FormData) => {
  const res = await fetch("/api/import/parse/fuelio", {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    Notify.error(result.message);
    throw new Error(result?.error || "Failed to import document");
  }

  Notify.success(result.message || "Document imported successfully");
  return result;
};
