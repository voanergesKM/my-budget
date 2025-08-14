import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import Providers from "@/app/providers";
import { inter } from "@/app/ui/fonts";
import Header from "@/app/ui/layout/Header";
import { routing } from "@/i18n/routing";

import "@/app/globals.css";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>
          <Providers>
            <Header />

            <main className="max-w-screen-3xl flex min-h-dvh w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary px-4">
              <div className="mx-auto min-h-dvh w-full">{children}</div>
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
