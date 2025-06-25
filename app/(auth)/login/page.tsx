import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoginForm from "../../ui/container/login-form";
import Button from "../../ui/components/button";

export default async function RegisterPage() {
  return (
    <>
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-2.5 p-4 md:-mt-32 bg-card rounded-lg shadow-lg">
        <LoginForm />
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
    </>
  );
}
