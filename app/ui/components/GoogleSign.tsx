"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import Button from "@/app/ui/components/Button";
import CircularProgress from "@/app/ui/components/CircularProgress";

import { GoogleIcon } from "@/app/assets/icons/google";

export default function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");
  const safeCallbackUrl = callbackUrl?.startsWith("/")
    ? callbackUrl
    : "/dashboard";

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: safeCallbackUrl,
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="large"
      color="secondary"
      onClick={handleGoogleSignIn}
      disabled={loading}
      startIcon={
        loading ? <CircularProgress size={20} /> : <GoogleIcon size={20} />
      }
      classes={{ root: "w-full" }}
    >
      Sign in with Google
    </Button>
  );
}
