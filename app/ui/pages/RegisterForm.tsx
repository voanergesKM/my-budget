"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AtSymbolIcon, KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "lucide-react";

import Button from "@/app/ui/components/Button";
import { TextField } from "@/app/ui/components/TextField";

import { UserAuthSchema } from "@/app/lib/schema/authSchema";

type ErrorState = {
  firstName?: string[];
  email?: string[];
  password?: string[];
  message?: string | null;
};

const initialErrorState: ErrorState = {
  firstName: [],
  email: [],
  password: [],
  message: "",
};

export default function RegisterForm() {
  const [state, setstate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(initialErrorState);
  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setstate({ ...state, [name]: value });
    error && setError({ ...error, [name]: [] });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { firstName, lastName, email, password } = state;

    const validateSchema = UserAuthSchema.safeParse(state);
    if (!validateSchema.success) {
      setError(validateSchema.error.flatten().fieldErrors);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const loginResponse = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (loginResponse?.error) {
        console.error("Login failed:", loginResponse.error);
        setError({ message: loginResponse.error });
      } else {
        console.log("Login successful");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("Registration Failed:", error);
      setError({ message: error.message });
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h1 className="mb-6 text-center text-2xl font-bold text-text-primary">
        Get started with <span className="text-secondary">MyBudget</span>.
      </h1>

      <TextField
        required
        label="First Name"
        value={state.firstName}
        onChange={onChange}
        name="firstName"
        hasError={Boolean(error.firstName?.length)}
        helperText={error.firstName}
        placeholder="Enter your first name"
        startAdornment={<UserCircleIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        label="Last Name"
        value={state.lastName}
        onChange={onChange}
        name="lastName"
        placeholder="Enter your last name"
        startAdornment={<UserCircleIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        required
        label="Email"
        value={state.email}
        onChange={onChange}
        name="email"
        hasError={Boolean(error.email?.length)}
        helperText={error.email}
        placeholder="Enter your email"
        startAdornment={<AtSymbolIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        required
        label="Password"
        type="password"
        value={state.password}
        onChange={onChange}
        name="password"
        hasError={Boolean(error.password?.length)}
        helperText={error.password}
        placeholder="Enter password"
        startAdornment={<KeyIcon className="w-5 text-text-secondary" />}
      />

      {error.message && <p className="mt-2 text-sm text-red-500">{error.message}</p>}

      <div className="flex justify-between">
        <Button href="/login" startIcon={<ArrowLeftIcon className="w-5 md:w-6" />} size="large">
          Go back
        </Button>

        <Button size="large" classes={{ root: "w-[160px]" }}>
          Register
        </Button>
      </div>
    </form>
  );
}
