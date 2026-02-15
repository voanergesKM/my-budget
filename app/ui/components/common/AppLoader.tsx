import React from "react";

import { cn } from "@/app/lib/utils/utils";

type Props = {
  size?: number;
  variant?: "barChart" | "spinner" | "lineChart" | "coins" | "dot";
  className?: string;
};

function AppLoader({ size = 100, variant = "barChart", className }: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-2xl",
        className
      )}
    >
      <Loader variant={variant} size={size} />
    </div>
  );
}

export default AppLoader;

function Loader({ variant, size }: { variant: string; size: number }) {
  switch (variant) {
    case "barChart":
      return <LoaderBars size={size} />;

    case "spinner":
      return <Spinner size={size} />;

    case "lineChart":
      return <LoaderLine size={size} />;

    case "coins":
      return <LoaderCoins size={size} />;

    case "dot":
      return <LoaderDots />;

    default:
      return null;
  }
}

export function LoaderBars({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="-4 0 80 60">
      <rect
        x="0"
        y="30"
        width="12"
        height="40"
        rx="3"
        className="bar fill-primary"
      />
      <rect
        x="20"
        y="18"
        width="12"
        height="52"
        rx="3"
        className="barA fill-primary"
      />
      <rect
        x="40"
        y="40"
        width="12"
        height="30"
        rx="3"
        className="barB fill-primary"
      />
      <rect
        x="60"
        y="25"
        width="12"
        height="45"
        rx="3"
        className="barC fill-primary"
      />
    </svg>
  );
}

export function Spinner({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <circle
        cx="30"
        cy="30"
        r="22"
        strokeWidth="6"
        className="stroke-primary/20"
        fill="none"
      />
      <circle
        cx="30"
        cy="30"
        r="22"
        strokeWidth="6"
        strokeDasharray="90"
        strokeLinecap="round"
        className="spinRing stroke-primary"
        fill="none"
      />
    </svg>
  );
}

export function LoaderLine({ size = 120 }) {
  return (
    <svg width={size} height={size / 2} viewBox="0 0 120 40">
      <polyline
        points="0,30 20,22 40,28 60,12 80,20 100,8 120,16"
        fill="none"
        strokeWidth="3"
        className="dashMove stroke-primary"
      />
    </svg>
  );
}

export function LoaderCoins({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="40" cy="55" rx="20" ry="6" className="coin1 fill-primary" />
      <ellipse cx="40" cy="40" rx="20" ry="6" className="coin2 fill-primary" />
      <ellipse cx="40" cy="25" rx="20" ry="6" className="coin3 fill-primary" />
    </svg>
  );
}

export function LoaderDots() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="dot" />
      ))}
    </div>
  );
}
