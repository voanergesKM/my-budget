import LoginForm from "@/app/ui/pages/LoginForm";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="auth-container">
        <LoginForm />
      </div>
    </div>
  );
}
