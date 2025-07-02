import { format, formatDistanceToNow, Locale } from "date-fns";
import { enUS, uk } from "date-fns/locale";

export type DateFormat = "full" | "short" | "compact" | "time";

// const LOCALE_MAP: Record<string, Locale> = {
//   en: enUS,
//   "en-US": enUS,
//   uk: uk,
//   "uk-UA": uk,
// };

// export const getDateFnsLocale = (localeCode: string): Locale => {
//   return LOCALE_MAP[localeCode] || enUS;
// };

// export const formatRelativeTime = (date: Date | string, localeCode = "en"): string => {
//   return formatDistanceToNow(new Date(date), {
//     addSuffix: true,
//     locale: getDateFnsLocale(localeCode),
//   });
// };

const getUserLocale = (): string => {
  if (typeof window !== "undefined" && window.navigator?.language) {
    return window.navigator.language;
  }
  return "en-US"; // fallback
};

const getLocale = () => {
  const userLocale = getUserLocale();

  if (userLocale.startsWith("uk")) return uk;
  if (userLocale.startsWith("en")) return enUS;

  return enUS;
};

// 🔹 YYYY-MM-DD
export const formatYearMonthDay = (date: Date | string): string => {
  return format(new Date(date), "yyyy-MM-dd", { locale: getLocale() });
};

// 🔸 DD.MM.YYYY
export const formatDayMonthYear = (date: Date | string): string => {
  return format(new Date(date), "dd.MM.yyyy", { locale: getLocale() });
};

// 🔸 2 July 2025
export const formatFullDate = (date: Date | string): string => {
  return format(new Date(date), "d MMMM yyyy", { locale: getLocale() });
};

// 🔹 2 July 2025 12:40
export const formatWithTime = (date: Date | string): string => {
  return format(new Date(date), "d MMM yyyy HH:mm", { locale: getLocale() });
};

export const formatDate = (date: Date | string, formatType: DateFormat): string => {
  const fmtDate = new Date(date);
  const locale = getLocale();

  switch (formatType) {
    case "full":
      return format(fmtDate, "d MMMM yyyy", { locale });
    case "short":
      return format(fmtDate, "dd.MM.yyyy", { locale });
    case "compact":
      return format(fmtDate, "yyyy-MM-dd", { locale });
    case "time":
      return format(fmtDate, "d MMM yyyy HH:mm", { locale });
    default:
      return format(fmtDate, "dd.MM.yyyy", { locale });
  }
};
