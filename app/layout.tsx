import type { Metadata } from "next";

import { inter } from "@/app/ui/fonts";
import Header from "@/app/ui/layout/Header";

import Providers from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "My Budget",
  description: "My budget app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Header />

          <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
