import Notify from "@/app/lib/utils/notify";

import { PublicUser } from "../../definitions";

export const updateUser = async (payload: PublicUser) => {
  try {
    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    Notify.error(error.message);
    return { success: false };
  }
};
