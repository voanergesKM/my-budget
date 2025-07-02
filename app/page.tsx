import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./ui/fonts";
import Button from "./ui/components/Button";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="mb-6 text-center text-4xl font-bold text-text-primary md:text-5xl">
        My Budget
      </div>

      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-card p-6 backdrop-blur-lg md:flex-row md:p-10">
        <div className="flex flex-col justify-center gap-6 text-text-primary md:w-2/5">
          <p
            className={`text-xl md:text-3xl md:leading-normal ${lusitana.className}`}
          >
            <strong>Control your finances.</strong> Plan, track, and manage your
            budget effortlessly with{" "}
            <span className="text-secondary">My Budget</span>.
          </p>
          <Button
            href="/login"
            endIcon={<ArrowRightIcon />}
            size="large"
            classes={{
              root: "w-[200px] ml-auto bg-button hover:bg-button-hover text-button-text",
            }}
          >
            Get Started
          </Button>
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
      </div>
    </>
  );
}

