import { Suspense } from "react";

import Providers from "@/app/providers";
import { inter } from "@/app/ui/fonts";
import Header from "@/app/ui/layout/Header";
import SideBar from "@/app/ui/layout/SideBar";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Header />

          <main className="max-w-screen-3xl flex min-h-dvh w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary px-4">
            <div className="mx-auto min-h-dvh w-full">
              <Suspense fallback={<div>Loading...</div>}>
                <SideBar />
              </Suspense>

              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
