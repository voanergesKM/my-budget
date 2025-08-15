"use client";

import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { Button } from "@/app/ui/shadcn/Button";

const GetStarted = () => {
  const isMobile = useIsMobile();

  const t = useTranslations("Common.buttons");

  return (
    <Button
      className="w-full font-semibold [&_svg]:size-6"
      size={isMobile ? "md" : "xl"}
      href="/login"
    >
      {t("getStarted")}
      <ArrowRightIcon />
    </Button>
  );
};

export default GetStarted;
