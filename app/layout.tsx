import type { Metadata } from "next";
import { auth } from "@/auth";
import { inter } from "@/app/ui/fonts";
import { lusitana } from "@/app/ui/fonts";
import "./globals.css";
import Header from "./ui/container/header";

export const metadata: Metadata = {
  title: "My Budget",
  description: "My budget app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <Header session={session} />

        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary">
          {children}
        </main>
      </body>
    </html>
  );
}
