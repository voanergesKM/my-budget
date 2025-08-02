"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/app/ui/shadcn/Button";

import { GoogleIcon } from "@/app/ui/icons/google";

export default function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");
  const safeCallbackUrl = callbackUrl?.startsWith("/") ? callbackUrl : "/";

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
      color="secondary"
      onClick={handleGoogleSignIn}
      isLoading={loading}
      className="w-full"
      size={"md"}
    >
      <GoogleIcon size={20} />
      Sign in with Google
    </Button>
  );
}
