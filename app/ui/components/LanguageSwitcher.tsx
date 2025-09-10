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
];

export function LanguageSwitcher() {
  const currentLocale = useLocale();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  function onChange(value: string) {
    if (isPending || currentLocale === value) {
      return;
    }
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });

    setOpen(false);
  }

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
              LANGUAGES.find((l) => l.code === currentLocale)?.countryCode ??
              "default-country-code"
            }
            style={{ width: "1.5em", height: "1.5em" }}
            svg
            alt="Country flag"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-40 flex-col gap-2 px-1 py-2"
        align="end"
        sideOffset={-2}
      >
        {LANGUAGES.map(({ code, countryCode, label }) => (
          <Button
            key={code}
            onClick={() => onChange(code)}
            aria-label={label}
            className="flex items-center justify-start gap-2 border-none bg-transparent text-text-primary"
            variant={"outline"}
          >
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{ width: "1.5em", height: "1.5em" }}
            />
            <span
              className={clsx(
                "text-sm",
                code === currentLocale && "font-medium"
              )}
            >
              {label}
            </span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
