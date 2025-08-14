import RegisterForm from "../_components/RegisterForm";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="auth-container">
        <RegisterForm />
      </div>
    </div>
  );
}
