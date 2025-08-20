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
      className={"rounded-full p-2 md:rounded-md"}
    >
      {Icon ? (
        <Icon className="!size-6" />
      ) : (
        <PlusCircleIcon className="!size-6" />
      )}
      {label && <span className="hidden md:inline">{label}</span>}
    </Button>
  );
};
