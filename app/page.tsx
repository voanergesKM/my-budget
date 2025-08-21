import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import HomePage from "@/app/ui/components/HomePage";
import Landing from "@/app/ui/components/Landing";
import { TabsAndTableLoader } from "@/app/ui/components/loaders/TabsAndTableLoader";

import Layout from "@/app/(private)/layout";
import { auth } from "@/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home");

  return {
    title: t("title"),
    description: t("description"),
  };
}

type SearchParams = Promise<{
  groupId: string;
  origin: "outgoing" | "incoming";
  page: string;
  pageSize: string;
}>;

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Landing />
      </Suspense>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<TabsAndTableLoader />}>
        <HomePage />
      </Suspense>
    </Layout>
  );
}
