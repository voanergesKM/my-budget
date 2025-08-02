import Notify from "@/app/lib/utils/notify";

export const updateUser = async (_prevState: any, formData: FormData) => {
  try {
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    Notify.success(data.message);

    return data;
  } catch (error: any) {
    Notify.error(error.message);
    return { success: false };
  }
};
