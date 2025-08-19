import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
} from "@/app/ui/shadcn/Tooltip";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  disableHoverListener?: boolean;
};

export function Tooltip({ children, content, disableHoverListener }: Props) {
  if (disableHoverListener) return children;

  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        {content}
        <TooltipPrimitive.Arrow
          className="fill-popover"
          width={30}
          height={10}
        />
      </TooltipContent>
    </TooltipRoot>
  );
}
