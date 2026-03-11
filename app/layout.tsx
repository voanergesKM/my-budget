import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";

import Providers from "@/app/providers";
import { inter } from "@/app/ui/fonts";
import Header from "@/app/ui/layout/Header";
import SideBar from "@/app/ui/layout/SideBar";
import { auth } from "@/auth";

import "@/app/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>
          <Providers>
            <Header />

            {session && <SideBar />}

            <main className="max-w-screen-3xl flex h-full min-h-dvh w-full flex-col bg-gradient-to-br from-primary to-secondary px-4">
              <div className="mx-auto flex h-full w-full flex-1 flex-col items-center">
                {children}
              </div>
            </main>
          </Providers>
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  );
}
