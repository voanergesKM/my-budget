import { ComponentType, FC } from "react";

import { GroupProvider } from "@/app/ui/context/CurrentGroupContext";
import { CurrentUserProvider } from "@/app/ui/context/CurrentUserContext";

export function withUserAndGroupContext<T extends object>(
  WrappedComponent: ComponentType<T>
): FC<T> {
  return function ComponentWithProviders(props: T) {
    return (
      <CurrentUserProvider>
        <GroupProvider>
          <WrappedComponent {...props} />
        </GroupProvider>
      </CurrentUserProvider>
    );
  };
}
