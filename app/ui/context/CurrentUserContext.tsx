import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { User } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUser } from "@/app/lib/api";

export const CurrentUserContext = createContext<User | null>(null);

export const CurrentUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();

  const { data: currentUser } = useQuery({
    queryKey: [QueryKeys.getCurrentUser],
    queryFn: getUser,
    enabled: !!session?.user,
  });

  return (
    <CurrentUserContext.Provider value={currentUser ?? null}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
