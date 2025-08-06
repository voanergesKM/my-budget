"use client";

import React, { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/Collapsible";

export interface CollapsibleAction<T = unknown> {
  label: string;
  Icon?: React.ElementType;
  onClick: (row: T) => void;
  disabled?: boolean | ((context: T) => boolean);
}

interface CollapsibleItemProps<T = unknown> {
  title: ReactNode;
  children: ReactNode;
  actions?: CollapsibleAction<T>[];
  context: T;
  className?: string;
  style?: React.CSSProperties;
}

const CollapsibleItem = <T,>({
  title,
  children,
  actions = [],
  context,
  className,
  style,
}: CollapsibleItemProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("flex flex-col gap-2 rounded-md border p-2", className)}
      style={style}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0 rounded-full p-1"
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
          <span className="text-md text-[var(--text-primary)]">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          {actions.map(({ label, Icon, onClick, disabled }, index) => {
            if (!Icon) return null;
            const isDisabled =
              typeof disabled === "function" ? disabled(context) : disabled;

            return (
              <Button
                key={label + index}
                size="icon"
                variant="ghost"
                className="rounded-full p-1"
                onClick={() => onClick(context!)}
                disabled={isDisabled}
                title={label}
              >
                <Icon />
              </Button>
            );
          })}
        </div>
      </div>

      <CollapsibleContent className="flex items-center gap-3 px-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleItem;
