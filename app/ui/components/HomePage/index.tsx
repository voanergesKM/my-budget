"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { getTransactionsList } from "@/app/lib/api/transactions/getTransactionsList";

import { usePaginationParams } from "@/app/lib/hooks/usePaginationParams";

import { Tabs, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useQueryKeys } from "./hooks/useQueryKeys";
import { Content } from "./Content";

function HomePage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");

  const t = useTranslations("Landing");

  const { currentPage: page, pageSize } = usePaginationParams();

  const queryKeys = useQueryKeys();

  const { data: transactions } = useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      getTransactionsList(
        groupId || null,
        origin || "outgoing",
        (page ?? 1).toString(),
        (pageSize ?? 10).toString()
      ),
  });

  const tabValue = origin ?? "outgoing";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", value);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-4">
      <Tabs
        defaultValue={"outgoing"}
        value={tabValue}
        onValueChange={onValueChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
        </TabsList>
        {["outgoing", "incoming"].map((origin) => (
          <Content
            key={origin}
            origin={(origin as "outgoing" | "incoming") || "outgoing"}
            data={transactions}
          />
        ))}
      </Tabs>
    </div>
  );
}

const HomePageWithProviders = withUserAndGroupContext(HomePage);

export default HomePageWithProviders;
