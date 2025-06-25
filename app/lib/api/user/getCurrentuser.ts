import { serverFetch } from "@/app/lib/utils/serverFetch";

export const getCurrentUser = async () => {
  const data = await serverFetch<{ success: boolean; data: any }>("/api/users/me");
  return data.data;
};
