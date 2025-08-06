import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { User } from "@/app/lib/definitions";
import QueryKeys from "@/app/lib/utils/queryKeys";

import { getUser } from "@/app/lib/api/user/getUser";

export const CurrentUserContext = createContext<User | null>(null);

export const CurrentUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: currentUser } = useQuery({
    queryKey: [QueryKeys.getCurrentUser],
    queryFn: getUser,
  });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
