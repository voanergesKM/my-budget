"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

import { PageDateRange } from "@/app/ui/components/common/PageDateRange";

import { withUserAndGroupContext } from "@/app/ui/hoc/withUserAndGroupContext";

import { useCategoryStats } from "../hooks/useCategoryStats";

import { CategoriesPieView } from "./CategoriesPieView";

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const origin = searchParams.get("origin");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { data, isLoading, isError } = useCategoryStats({
    groupId: groupId || undefined,
    origin: origin ?? "outgoing",
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", value);

    router.push(`?${params.toString()}`);
  };

  const tabValue = origin ?? "outgoing";

  return (
    <div className="relative mt-4">
      <div className="absolute -right-2 top-5 z-20 md:right-0 md:top-0">
        <PageDateRange />
      </div>
      <Tabs
        defaultValue={"outgoing"}
        value={tabValue}
        onValueChange={onValueChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
        </TabsList>
      </Tabs>

      <CategoriesPieView data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
}

export default withUserAndGroupContext(Dashboard);
