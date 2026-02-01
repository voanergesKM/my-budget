import Notify from "@/app/lib/utils/notify";

export const sendBackup = async (payload: any) => {
  console.log("🚀 ~ sendBackup ~ payload: ", payload);
  const res = await fetch("/api/import", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    Notify.error(result.message);
    throw new Error(result?.error || "Failed to send backup");
  }

  Notify.success(result.message || "Backup sent successfully");
  return result;
};
