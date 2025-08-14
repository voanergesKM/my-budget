import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getMessages } from "@/app/lib/intl/intl"; // якщо потрібно завантажувати messages на сервері
import { lusitana } from "@/app/ui/fonts";

import GetStarted from "./GetStartedButton";

export const metadata: Metadata = {
  title: "My Budget",
  description: "Control your finances with My Budget app.",
};
type Props = {
  params: { locale: string };
};

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;

  const intl = await getMessages(locale, "Landing"); // якщо потрібно завантажити переклади на сервері

  if (!intl) return notFound();

  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="mb-6 text-center text-4xl font-bold text-text-primary md:text-5xl">
        My Budget
      </div>

      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-card p-6 backdrop-blur-lg md:flex-row md:p-10">
        <div className="flex flex-col justify-center gap-6 text-text-primary md:w-2/5">
          <p
            className={`text-xl md:text-3xl md:leading-normal ${lusitana.className}`}
          >
            <strong>{intl.title}</strong> {intl.subtitle}
            <span className="text-secondary"> My Budget</span>.
          </p>

          <span className="mt-8 hidden md:block">
            <GetStarted />
          </span>
        </div>

        <div className="flex items-center justify-center p-6 md:w-3/5">
          <Image
            src="/hero-desktop.webp"
            width={800}
            height={600}
            className="hidden rounded-xl md:block"
            alt="Dashboard preview"
            priority
          />
          <Image
            src="/hero-desktop.webp"
            width={400}
            height={500}
            className="block rounded-xl md:hidden"
            alt="Mobile dashboard preview"
            priority
          />
        </div>

        <span className="md:hidden">
          <GetStarted />
        </span>
      </div>
    </div>
  );
}
