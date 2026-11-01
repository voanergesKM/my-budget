"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchIcon, X } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";
import { Input } from "@/app/ui/shadcn/Input";

import { getSearchRoute } from "./searchRoutes";

export default function HeaderSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Table");
  const route = getSearchRoute(pathname, searchParams.get("tab"));

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {route ? (
        <Search key={route.key} label={t(route.label)} />
      ) : (
        <Link
          href="/"
          className="flex-1 truncate text-center text-2xl font-bold text-text-primary md:text-left"
        >
          My Budget
        </Link>
      )}
    </div>
  );
}

function Search({ label }: { label: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [value, setValue] = useState(query);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  const t = useTranslations("Table");
  const expanded = open || Boolean(query) || Boolean(value);

  useEffect(() => {
    clearTimeout(timer.current);
    setValue(query);
  }, [query]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function updateUrl(nextValue: string) {
    const url = new URL(window.location.href);
    const trimmed = nextValue.trim();
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
  }

  function onChange(nextValue: string) {
    setValue(nextValue);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => updateUrl(nextValue), 300);
  }

  return (
    <>
      <Link
        href="/"
        className={`${expanded ? "hidden md:block" : "block"} min-w-0 flex-1 truncate text-center text-2xl font-bold text-text-primary md:text-left`}
      >
        My Budget
      </Link>
      {expanded ? (
        <div className="relative min-w-0 flex-1 duration-200 animate-in fade-in slide-in-from-right-4 motion-reduce:animate-none md:ml-4 md:max-w-sm">
          <SearchIcon
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={input}
            type="search"
            maxLength={200}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !value && !query) setOpen(false);
            }}
            placeholder={label}
            aria-label={label}
            className="pl-9 pr-10 [&::-webkit-search-cancel-button]:hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-10 w-10 text-text-primary hover:bg-transparent"
            aria-label={value || query ? t("clearSearch") : t("closeSearch")}
            onClick={() => {
              clearTimeout(timer.current);
              if (value || query) {
                setOpen(true);
                setValue("");
                updateUrl("");
                input.current?.focus();
              } else setOpen(false);
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          className="shrink-0 text-text-primary"
          onClick={() => {
            setOpen(true);
            requestAnimationFrame(() => input.current?.focus());
          }}
        >
          <SearchIcon />
        </Button>
      )}
    </>
  );
}
