import LoginForm from "../../ui/container/login-form";
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
