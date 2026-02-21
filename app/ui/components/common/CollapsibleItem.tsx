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
      <div className="flex flex-shrink-0 items-center justify-between gap-6">
        <div className="flex w-full items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 flex-shrink-0 rounded-full p-1"
              aria-label="Toggle collapsible"
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
          <div className="text-md w-full text-[var(--text-primary)]">
            {title}
          </div>
        </div>

        <div className="flex w-fit items-center justify-end gap-2">
          {actions.map(({ label, Icon, onClick, disabled }, index) => {
            if (!Icon) return null;
            const isDisabled =
              typeof disabled === "function" ? disabled(context) : disabled;

            return (
              <Button
                key={label + index}
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full p-0"
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
