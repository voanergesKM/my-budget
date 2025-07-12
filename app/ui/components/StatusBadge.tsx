import { JSX } from "react";
import { AlertCircleIcon, ArchiveIcon, CheckIcon } from "lucide-react";

import { cn } from "@/app/lib/utils/utils";

import { Badge } from "../shadcn/Badge";

import SpinnerIcon from "./SpinnerIcon";

type Status = "completed" | "in-progress" | "archived";

type StatusBadgeProps = {
  status: Status;
  label?: string;
  onClick?: () => void;
  loading?: boolean;
};

export function StatusBadge({ status, label, onClick, loading }: StatusBadgeProps) {
  const config: Record<Status, { label: string; icon: JSX.Element; variant: string }> = {
    completed: {
      label: "Completed",
      icon: <CheckIcon className="h-3 w-3" />,
      variant: "success",
    },
    "in-progress": {
      label: "In Progress",
      icon: <AlertCircleIcon className="h-3 w-3" />,
      variant: "default",
    },
    archived: {
      label: "Archived",
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
      {loading ? <SpinnerIcon className="h-3 w-3 animate-spin text-text-primary" /> : icon}
      {displayLabel}
    </Badge>
  );
}
