"use server";

import { cookies } from "next/headers";

import { defaultLocale, Locale, locales } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function getUserLocale(): Promise<Locale> {
  const savedLocale = (await cookies()).get(COOKIE_NAME)?.value;
  return locales.find((locale) => locale === savedLocale) ?? defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  if (!locales.some((supportedLocale) => supportedLocale === locale)) {
    throw new Error("Unsupported locale");
  }

  (await cookies()).set(COOKIE_NAME, locale, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}
