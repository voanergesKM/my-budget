import { serverFetch } from "@/app/lib/utils/serverFetch";

export async function getGroupNameById(groupId?: string | string[]) {
  if (!groupId) return undefined;

  try {
    const res = await serverFetch<{ success: boolean; data: any }>(
      "/api/group?id=" + groupId
    );
    return res.data?.name ?? undefined;
  } catch {
    return undefined;
  }
}
