"use client";

import { useActionState } from "react";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/button";
import { authenticate } from "@/app/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import GoogleSignIn from "../components/google-sign";
import { TextField } from "../components/TextField";
import CircularProgress from "../components/CircularProgress";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div>
      <form
        action={formAction}
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
            startAdornment={<KeyIcon className="w-5 text-text-secondary" />}
            classes={{ root: "mt-4" }}
          />
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <div className="mt-8"></div>
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

        <div className="flex items-end space-x-1">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
