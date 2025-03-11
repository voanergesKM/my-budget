import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import { lusitana } from "@/app/ui/fonts";
import Header from "../ui/container/header";
import SideNav from "../ui/container/sidenav";

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
    <div className="mx-auto max-w-screen-2xl w-full min-h-screen flex flex-col pt-[78px]">
      <div className="flex flex-1">
        <div className="flex-shrink-0">
          <SideNav />
        </div>

        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
