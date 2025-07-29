import { Suspense } from "react";

import LoginForm from "@/app/ui/pages/LoginForm";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="auth-container">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
