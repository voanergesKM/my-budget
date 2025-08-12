import { useCurrentGroup } from "@/app/ui/context/CurrentGroupContext";
import { useCurrentUser } from "@/app/ui/context/CurrentUserContext";

export const useDefaultCurrency = (): string => {
  const { group: currentGroup } = useCurrentGroup();
  const currentUser = useCurrentUser();

  const currency =
    currentGroup?.defaultCurrency || currentUser?.defaultCurrency;

  return currency || "USD";
};
