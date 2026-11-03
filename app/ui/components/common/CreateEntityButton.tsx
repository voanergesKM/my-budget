"use client";

import React, { forwardRef } from "react";
import { PlusCircleIcon } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { useIsMobile } from "@/app/lib/hooks/use-mobile";

import { Button } from "@/app/ui/shadcn/Button";

type Props = React.ComponentPropsWithoutRef<"button"> & {
  label: string;
  Icon?: React.ElementType;
  disableHoverListener?: boolean;
};

export const CreateEntityButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      Icon,
      className,
      disableHoverListener: _disableHoverListener,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();

    return (
      <Button
        {...props}
        ref={ref}
        aria-label={label}
        size={isMobile ? "icon" : "default"}
        className={cn("rounded-full p-2 md:rounded-md", className)}
      >
        {Icon ? (
          <Icon className="!size-6" />
        ) : (
          <PlusCircleIcon className="!size-6" />
        )}
        {label && <span className="hidden md:inline">{label}</span>}
      </Button>
    );
  }
);
CreateEntityButton.displayName = "CreateEntityButton";
