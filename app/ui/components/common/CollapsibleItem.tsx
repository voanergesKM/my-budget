"use client";

import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/ui/shadcn/Collapsible";
import { Button } from "@/app/ui/shadcn/Button";

interface CollapsibleItemProps {
  title: string;
  children: ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

const CollapsibleItem = ({ title, children, onDelete, onEdit }: CollapsibleItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 rounded-md border p-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="h-8 w-8 flex-shrink-0 rounded-full p-1"
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
          <span className="text-md text-[var(--text-primary)]">{title}</span>
        </div>

        <div>
          {onEdit && (
            <Button size={"icon"} variant={"ghost"} className="rounded-full p-1" onClick={onEdit}>
              <Edit />
            </Button>
          )}
          {onDelete && (
            <Button size={"icon"} variant={"ghost"} className="rounded-full p-1" onClick={onDelete}>
              <Trash />
            </Button>
          )}
        </div>
      </div>
      <CollapsibleContent className="flex items-center gap-3 px-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleItem;
