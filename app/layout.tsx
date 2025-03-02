import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import { lusitana } from "@/app/ui/fonts";
import "./globals.css";
import Header from "./ui/components/container/header/NavBar";

export const metadata: Metadata = {
  title: "My Budget",
  description: "My budget app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
