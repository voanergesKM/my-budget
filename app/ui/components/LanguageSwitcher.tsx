"use client";

import { useState, useTransition } from "react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "next-intl";
import clsx from "clsx";

import { Button } from "@/app/ui/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/shadcn/Popover";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";

const LANGUAGES = [
  { code: "en", countryCode: "GB", label: "English" },
  { code: "uk", countryCode: "UA", label: "Українська" },
] as const;

export function LanguageOptions({ onSelect }: { onSelect?: () => void }) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  function onChange(value: Locale) {
    if (isPending || currentLocale === value) return;
    startTransition(async () => {
      await setUserLocale(value);
    });
    onSelect?.();
  }

  return (
    <div className="flex flex-col gap-1">
      {LANGUAGES.map(({ code, countryCode, label }) => (
        <Button
          key={code}
          onClick={() => onChange(code)}
          disabled={isPending}
          aria-pressed={code === currentLocale}
          className="flex h-9 items-center justify-start gap-2 border-none bg-transparent px-2 text-text-primary"
          variant="outline"
        >
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{ width: "1.5em", height: "1.5em" }}
          />
          <span
            className={clsx("text-sm", code === currentLocale && "font-bold")}
          >
            {label}
          </span>
        </Button>
      ))}
    </div>
  );
}

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 p-0 hover:bg-transparent"
          aria-label="Language switcher"
        >
          <ReactCountryFlag
            countryCode={
              LANGUAGES.find((language) => language.code === currentLocale)
                ?.countryCode ?? "GB"
            }
            style={{ width: "1.5em", height: "1.5em" }}
            svg
            alt="Country flag"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 px-1 py-2" align="end" sideOffset={-2}>
        <LanguageOptions onSelect={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
