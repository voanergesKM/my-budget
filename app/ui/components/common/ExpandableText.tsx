import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

export default function ExpandableText({
  text,
  label,
  emptyText = "—",
}: {
  text?: string | null;
  label: string;
  emptyText?: string;
}) {
  const t = useTranslations("Table");
  const [open, setOpen] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const previewRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const closeAfterHover = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };
  const openOnHover = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const isTruncated = preview.scrollHeight > preview.clientHeight + 1;
      setTruncated(isTruncated);
      if (!isTruncated) setOpen(false);
    };

    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(preview);
    window.addEventListener("resize", measure);
    document.fonts?.addEventListener("loadingdone", measure);
    document.fonts?.ready.then(measure);
    return () => {
      active = false;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [text, truncated]);

  if (!text) return <>{emptyText}</>;

  const preview = (
    <span
      ref={previewRef}
      className="line-clamp-3 whitespace-pre-line break-words"
    >
      {text}
    </span>
  );

  if (!truncated) return preview;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("showFullText", { field: label })}
          className="block w-full min-w-0 max-w-full cursor-pointer rounded text-left text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onPointerEnter={openOnHover}
          onPointerLeave={closeAfterHover}
        >
          {preview}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={label}
        tabIndex={0}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerEnter={openOnHover}
        onPointerLeave={closeAfterHover}
        className="max-h-[min(60vh,32rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto whitespace-pre-wrap break-words border text-sm text-text-primary"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}
