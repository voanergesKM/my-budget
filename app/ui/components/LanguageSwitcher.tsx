"use client";

import ReactCountryFlag from "react-country-flag";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Cookies from "js-cookie";

import { Button } from "../shadcn/Button";

const LANGUAGES = [
  { code: "en", countryCode: "GB", label: "English" },
  { code: "uk", countryCode: "UA", label: "Українська" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLocale = pathname.split("/")[1];

  const changeLanguage = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/");

    const fullUrl = searchParams.toString()
      ? `${newPath}?${searchParams.toString()}`
      : newPath;

    Cookies.set("locale", locale, { expires: 365, path: "/" });
    router.push(fullUrl);
  };

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(({ code, countryCode, label }) => (
        <Button
          key={code}
          size="icon"
          variant={currentLocale === code ? "default" : "ghost"}
          className={clsx("h-9 w-9 p-0")}
          onClick={() => changeLanguage(code)}
          aria-label={label}
        >
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{ width: "1.5em", height: "1.5em" }}
          />
        </Button>
      ))}
    </div>
  );
}
