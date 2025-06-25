import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/components/button";
import RegisterForm from "../../ui/container/register-form";

export default async function RegisterPage() {
  return (
    <>
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-2.5 p-4 md:-mt-32 bg-card rounded-lg shadow-lg">
        <RegisterForm />
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
    </>
  );
}
