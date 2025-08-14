import LoginForm from "../_components/LoginForm";

export default async function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="auth-container">
        <LoginForm />
      </div>
    </div>
  );
}
