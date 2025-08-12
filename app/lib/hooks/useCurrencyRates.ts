"use client";

import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import { ExchangeRate } from "../definitions";

export function useCurrencyRates(): ExchangeRate {
  const { data } = useQuery({
    queryKey: [QueryKeys.currencyRates],
    queryFn: async () => {
      const rates = await fetch("/api/currency-rates");

      if (!rates.ok) {
        throw new Error("Failed to fetch currency rates");
      }

      return await rates.json();
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  return data?.data;
}
