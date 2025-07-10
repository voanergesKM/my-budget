"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";

import { SessionProvider } from "next-auth/react";

import Toast from "@/app/ui/container/ToastContainer";
import { SidebarProvider } from "@/app/ui/shadcn/Sidebar";
import { ForbiddenError } from "./lib/errors/customErrors";

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
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toast />
      </SidebarProvider>
    </SessionProvider>
  );
}
