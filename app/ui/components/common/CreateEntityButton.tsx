"use client";

import { PlusCircleIcon } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { Button } from "@/app/ui/shadcn/Button";

type Props = {
  label: string;
  Icon?: React.ElementType;
  onClick?: () => void;
  disableHoverListener?: boolean;
};

export const CreateEntityButton = ({ label, Icon, onClick }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Button
      onClick={onClick}
      size={isMobile ? "icon" : "default"}
      className={cn(isMobile && "rounded-full")}
    >
      {Icon ? (
        <Icon className="!size-6" />
      ) : (
        <PlusCircleIcon className="!size-6" />
      )}
      {!isMobile && label}
    </Button>
  );
};
