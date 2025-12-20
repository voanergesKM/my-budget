import * as React from "react";

import { cn } from "@/app/lib/utils/utils";

import { Label } from "@/app/ui/shadcn/label";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    minRows?: number;
    maxRows?: number;
    label?: string;
  }
>(({ className, minRows = 1, maxRows = 10, label, ...props }, ref) => {
  const localRef = React.useRef<HTMLTextAreaElement | null>(null);

  // merge forwarded ref and localRef
  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      localRef.current = node;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          node;
      }
    },
    [ref]
  );

  const adjustHeight = React.useCallback(() => {
    const target = localRef.current;
    if (!target) return;
    // reset to measure correctly
    target.style.height = "auto";
    const scrollHeight = target.scrollHeight;

    // try to read line-height, fallback to 24
    const computed = window.getComputedStyle(target);
    const lineHeight = parseFloat(computed.lineHeight || "24") || 24;

    const maxHeight = maxRows * lineHeight + 16; // +16 for padding
    const newHeight = Math.min(scrollHeight, maxHeight);
    target.style.height = `${newHeight}px`;
    target.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [maxRows]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    const scrollHeight = target.scrollHeight;

    const computed = window.getComputedStyle(target);
    const lineHeight = parseFloat(computed.lineHeight || "24") || 4;

    const maxHeight = maxRows * lineHeight;
    const newHeight = Math.min(scrollHeight, maxHeight);
    target.style.height = `${newHeight}px`;
    target.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    // propagate onChange if parent passed it
    if (props.onInput) {
      (props.onInput as (e: React.FormEvent<HTMLTextAreaElement>) => void)(e);
    }
  };

  // adjust on mount and when value/minRows/maxRows change
  React.useLayoutEffect(() => {
    adjustHeight();
    // also observe broad changes to content (in case value is set after mount)
    const el = localRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => adjustHeight());
    ro.observe(el);
    return () => ro.disconnect();
  }, [adjustHeight, props.value, minRows, maxRows]);

  return (
    <div className="grid w-full gap-3">
      {label && <Label htmlFor={label}>{label}</Label>}

      <textarea
        id={label}
        className={cn(
          "flex w-full resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
          "data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive data-[invalid=true]:focus-visible:ring-destructive data-[invalid=true]:focus-visible:ring-offset-0",
          className
        )}
        ref={setRefs}
        rows={minRows}
        onInput={handleInput}
        style={{ boxSizing: "border-box" }}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
