"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/app/ui/shadcn/Button";

import GoogleSignIn from "@/app/ui/components/GoogleSign";
import { TextField } from "@/app/ui/components/TextField";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      callbackUrl,
      redirect: false,
    });

    if (res?.error) {
      setErrorMessage("Invalid credentials");
      setIsPending(false);
    } else {
      router.replace(callbackUrl);
      router.refresh();
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1 className="mb-6 text-center text-2xl font-bold text-text-primary">
        Log in to continue.
      </h1>

      <TextField
        required
        label="Email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        startAdornment={<AtSymbolIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        required
        label="Password"
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        startAdornment={<KeyIcon className="w-5 text-text-secondary" />}
        classes={{ root: "mt-4" }}
      />

      <div className="mt-8" />
      <Button
        type="submit"
        disabled={isPending}
        isLoading={isPending}
        size={"md"}
        className="w-full"
      >
        Log in
      </Button>

      <GoogleSignIn />

      <Button
        variant={"link"}
        href="/register"
        className="mt-4 flex justify-center rounded-lg text-center text-sm font-medium text-text-primary transition-colors hover:text-text-secondary md:text-base"
      >
        Don't have an account? Register.
      </Button>

      {errorMessage && (
        <div className="flex items-end space-x-1">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
