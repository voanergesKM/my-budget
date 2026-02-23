"use client";

import React, { JSX } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircleIcon,
  ArchiveIcon,
  CheckIcon,
  PauseCircleIcon,
} from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { Badge } from "@/app/ui/shadcn/Badge";

import SpinnerIcon from "./SpinnerIcon";

export type StatusType =
  | "completed"
  | "in-progress"
  | "archived"
  | "paused"
  | "cancelled"
  | "active"
  | "scheduled"
  | "due"
  | "overdue"
  | "dismissed";

type StatusBadgeProps = {
  status: StatusType;
  label?: string;
  onClick?: () => void;
  loading?: boolean;
};

export function StatusBadge({
  status,
  label,
  onClick,
  loading,
}: StatusBadgeProps) {
  const t = useTranslations("Status");

  const config: Record<
    StatusType,
    { label: string; icon: JSX.Element; variant: string }
  > = {
    completed: {
      label: t("completed"),
      icon: <CheckIcon className="h-3 w-3" />,
      variant: "success",
    },

    scheduled: {
      label: t("scheduled"),
      icon: <PauseCircleIcon className="h-3 w-3" />,
      variant: "secondary",
    },
    "in-progress": {
      label: t("inProgress"),
      icon: <AlertCircleIcon className="h-3 w-3" />,
      variant: "default",
    },
    archived: {
      label: t("archived"),
      icon: <ArchiveIcon className="h-3 w-3" />,
      variant: "destructive",
    },
    active: {
      label: t("active"),
      icon: <CheckIcon className="h-3 w-3" />,
      variant: "success",
    },
    paused: {
      label: t("paused"),
      icon: <PauseCircleIcon className="h-3 w-3" />,
      variant: "secondary",
    },
    cancelled: {
      label: t("cancelled"),
      icon: <ArchiveIcon className="h-3 w-3" />,
      variant: "destructive",
    },
    due: {
      label: t("due"),
      icon: <AlertCircleIcon className="h-3 w-3" />,
      variant: "default",
    },
    overdue: {
      label: t("overdue"),
      icon: <AlertCircleIcon className="h-3 w-3" />,
      variant: "destructive",
    },
    dismissed: {
      label: t("dismissed"),
      icon: <ArchiveIcon className="h-3 w-3" />,
      variant: "secondary",
    },
  };

  const { icon, variant } = config[status];

  const displayLabel = label ?? config[status].label;

  const handleBadgeClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (onClick && !loading) {
      onClick();
    }
  };

  return (
    <Badge
      variant={variant as any}
      className={cn("gap-1", {
        "cursor-pointer": !!onClick,
      })}
      onClick={handleBadgeClick}
    >
      {loading ? (
        <SpinnerIcon className="h-3 w-3 animate-spin text-text-primary" />
      ) : (
        icon
      )}
      {displayLabel}
    </Badge>
  );
}
