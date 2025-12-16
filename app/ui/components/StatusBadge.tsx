"use client";

import { JSX } from "react";
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

type Status =
  | "completed"
  | "in-progress"
  | "archived"
  | "paused"
  | "cancelled"
  | "active";

type StatusBadgeProps = {
  status: Status;
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
    Status,
    { label: string; icon: JSX.Element; variant: string }
  > = {
    completed: {
      label: t("completed"),
      icon: <CheckIcon className="h-3 w-3" />,
      variant: "success",
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
  };

  const { icon, variant } = config[status];

  const displayLabel = label ?? config[status].label;

  const handleBadgeClick = () => {
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
