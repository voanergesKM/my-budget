"use client";

import { SessionProvider } from "next-auth/react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { SidebarProvider } from "@/app/ui/shadcn/Sidebar";

import { ForbiddenError } from "@/app/lib/errors/customErrors";
import Toast from "@/app/ui/container/ToastContainer";
import { ColorSchemeProvider } from "./ui/context/ColorSchemeContext";
import { CurrentUserProvider } from "./ui/context/CurrentUserContext";

// import { TanStackDevtools } from "@tanstack/react-devtools";
// import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof ForbiddenError) return false;
          return failureCount < 3;
        },
        staleTime: 1000 * 60,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CurrentUserProvider>
          <ColorSchemeProvider>
            <SidebarProvider>
              {children}
              <Toast />
            </SidebarProvider>
          </ColorSchemeProvider>
        </CurrentUserProvider>

        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        {/* <TanStackDevtools plugins={[formDevtoolsPlugin()]} /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
}
