"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/button";
import GoogleSignIn from "../components/google-sign";
import { TextField } from "../components/TextField";
import CircularProgress from "../components/CircularProgress";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-card p-6 shadow-lg md:p-8"
      >
        <h1 className="mb-6 text-2xl font-bold text-text-primary text-center">
          Log in to continue.
        </h1>

        <div className="w-full">
          <TextField
            required
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            startAdornment={
              <AtSymbolIcon className="w-5 text-text-secondary" />
            }
          />

          <TextField
            required
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            startAdornment={<KeyIcon className="w-5 text-text-secondary" />}
            classes={{ root: "mt-4" }}
          />
        </div>

        <div className="mt-8" />
        <Button
          size="large"
          aria-disabled={isPending}
          classes={{ root: "w-full" }}
          type="submit"
          disabled={isPending}
          endIcon={isPending && <CircularProgress size={20} />}
        >
          Log in
        </Button>

        <GoogleSignIn />

        <Button
          href="/register"
          className="mt-4 text-center justify-center flex text-text-primary rounded-lg text-sm font-medium hover:text-text-secondary transition-colors md:text-base"
        >
          <span>Don't have an account? Register.</span>
        </Button>

        {errorMessage && (
          <div className="flex items-end space-x-1">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
}
