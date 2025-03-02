import { Suspense } from "react";
import RegisterForm from "../ui/components/container/register-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Button from "../ui/components/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center md:h-screen bg-gradient-to-br from-primary to-secondary relative p-6">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-2.5 p-4 md:-mt-32 bg-card rounded-lg shadow-lg">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>

      <Button
        size="small"
        href="/"
        classes={{
          root: "absolute top-6 right-6",
        }}
        startIcon={<ArrowLeftIcon className="w-5 md:w-6" />}
      >
        Go back
      </Button>
    </main>
  );
}
