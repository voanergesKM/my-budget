import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import "./globals.css";
import Header from "./ui/container/header";
import Providers from "./providers";

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
      <body className={`${inter.className}  antialiased`}>
        <Providers>
          <Header />

          <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
