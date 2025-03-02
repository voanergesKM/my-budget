import { Suspense } from "react";
import LoginForm from "../ui/components/container/login-form";
import Button from "../ui/components/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function RegisterPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-gradient-to-br from-primary to-secondary relative min-h-screen p-6">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-2.5 p-4 md:-mt-32 bg-card rounded-lg shadow-lg">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      <Button
        href="/"
        size="small"
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
