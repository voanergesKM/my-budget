"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

type CategoryTypeTabsProps = {
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export const CategoryTypeTabs = ({
  children,
  actions,
}: CategoryTypeTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const t = useTranslations("CategoryTypes");

  const tabValue = origin ?? "outgoing";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("origin", value);

    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={"outgoing"}
      value={tabValue}
      onValueChange={onValueChange}
    >
      <div className="flex justify-between">
        {actions}
        <TabsList className="mb-4 bg-transparent">
          <TabsTrigger value="outgoing">{t("outgoing")}</TabsTrigger>
          <TabsTrigger value="incoming">{t("incoming")}</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
