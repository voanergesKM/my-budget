import React from "react";

import { cn } from "@/app/lib/utils/utils";

function Paper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md bg-card px-3 py-3 md:rounded-xl md:px-4 md:py-4 xl:rounded-2xl xl:px-6 xl:py-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Paper;
