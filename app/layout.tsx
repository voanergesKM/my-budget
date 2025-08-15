import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import Providers from "@/app/providers";
import { inter } from "@/app/ui/fonts";
import Header from "@/app/ui/layout/Header";
import SideBar from "@/app/ui/layout/SideBar";

import "@/app/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>
          <Providers>
            <Header />

            <SideBar />

            <main className="max-w-screen-3xl flex min-h-dvh w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary px-4">
              <div className="mx-auto min-h-dvh w-full">{children}</div>
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
