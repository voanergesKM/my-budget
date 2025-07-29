import RegisterForm from "@/app/ui/pages/RegisterForm";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="auth-container">
        <RegisterForm />
      </div>
    </div>
  );
}
