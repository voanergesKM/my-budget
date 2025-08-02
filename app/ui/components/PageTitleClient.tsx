"use client";

import dynamic from "next/dynamic";

const PageTitle = dynamic(() => import("@/app/ui/components/PageTitle"), {
  ssr: false,
});

export default function PageTitleClient({ title }: { title?: string }) {
  return <PageTitle title={title} />;
}
