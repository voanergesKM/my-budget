import { useSearchParams } from "next/navigation";

export const useGroupIdFromSearchParams = (): string | null => {
  const searchParams = useSearchParams();

  const groupId = searchParams.get("groupId");

  return groupId || null;
};
