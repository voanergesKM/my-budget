"use client";

import { ArrowRightIcon } from "lucide-react";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { Button } from "@/app/ui/shadcn/Button";

const GetStarted = () => {
  const isMobile = useIsMobile();

  return (
    <Button
      className="w-full font-semibold [&_svg]:size-6"
      size={isMobile ? "md" : "xl"}
      href="/login"
    >
      Get Started
      <ArrowRightIcon />
    </Button>
  );
};

export default GetStarted;
