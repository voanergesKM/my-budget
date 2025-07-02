import LoginForm from "@/app/ui/pages/LoginForm";
import { Suspense } from "react";

export default async function RegisterPage() {
  return (
    <div className="auth-container">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
