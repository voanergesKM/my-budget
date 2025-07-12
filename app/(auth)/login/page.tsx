import { Suspense } from "react";

import LoginForm from "@/app/ui/pages/LoginForm";

export default async function RegisterPage() {
  return (
    <div className="auth-container">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
