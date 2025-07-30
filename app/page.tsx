import Image from "next/image";

import GetStarted from "@/app/ui/components/GetStartedButton";

import Layout from "@/app/(private)/layout";
import { lusitana } from "@/app/ui/fonts";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
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
              <strong>Control your finances.</strong> Plan, track, and manage
              your budget effortlessly with{" "}
              <span className="text-secondary">My Budget</span>.
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
            />
            <Image
              src="/hero-desktop.webp"
              width={400}
              height={500}
              className="block rounded-xl md:hidden"
              alt="Mobile dashboard preview"
            />
          </div>

          <span className="md:hidden">
            <GetStarted />
          </span>
        </div>
      </div>
    );
  }

  return <Layout>Main Page</Layout>;
}
