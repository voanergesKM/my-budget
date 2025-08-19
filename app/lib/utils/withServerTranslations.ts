import { getLocale, getTranslations } from "next-intl/server";

export async function withServerTranslations(namespace: string) {
  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace });

  return t;
}
