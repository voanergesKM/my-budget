import { JSX } from "react";
import { AlertCircleIcon, ArchiveIcon, CheckIcon } from "lucide-react";
import { Badge } from "../shadcn/Badge";

type Status = "completed" | "in-progress" | "archived";

type StatusBadgeProps = {
  status: Status;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config: Record<
    Status,
    { label: string; icon: JSX.Element; variant: string }
  > = {
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

  return (
    <Badge variant={variant as any} className="gap-1" onClick={() => {}}>
      {icon}
      {displayLabel}
    </Badge>
  );
}
