"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AtSymbolIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "@/app/ui/components/button";
import { UserAuthSchema } from "@/app/lib/schema/authSchema";
import { signIn } from "next-auth/react";
import { TextField } from "../components/TextField";

type ErrorState = {
  name?: string[];
  email?: string[];
  password?: string[];
  message?: string | null;
};

const initialErrorState: ErrorState = {
  name: [],
  email: [],
  password: [],
  message: "",
};

export default function RegisterForm() {
  const [state, setstate] = useState({
    name: "",
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

    const { name, email, password } = state;

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
        body: JSON.stringify({ name, email, password }),
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
    <form
      className="space-y-4 rounded-lg bg-card p-6 shadow-lg md:p-8"
      onSubmit={onSubmit}
    >
      <h1 className="mb-6 text-2xl font-bold text-text-primary text-center">
        Get started with <span className="text-secondary">MyBudget</span>.
      </h1>

      <TextField
        required
        label="Name"
        value={state.name}
        onChange={onChange}
        name="name"
        hasError={Boolean(error.name?.length)}
        helperText={error.name}
        placeholder="Enter your name"
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

      {error.message && (
        <p className="text-sm text-red-500 mt-2">{error.message}</p>
      )}

      <Button size="large" classes={{ root: "ml-auto" }}>
        Register
      </Button>
    </form>
  );
}
