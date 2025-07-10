"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function usePaginationParams(defaultPageSize = 10) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(
    searchParams.get("pageSize") || defaultPageSize.toString(),
    10
  );

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const setPageSize = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // reset page
    params.set("pageSize", size.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    currentPage,
    pageSize,
    setPage,
    setPageSize,
  };
}
