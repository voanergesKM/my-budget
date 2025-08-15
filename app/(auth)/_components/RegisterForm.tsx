"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  AtSymbolIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/app/ui/shadcn/Button";

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
  const router = useRouter();

  const [state, setstate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(initialErrorState);

  const t = useTranslations("Auth.register");
  const tc = useTranslations("Common.inputs");
  const tb = useTranslations("Common.buttons");
  const tn = useTranslations("Notifications");

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
        throw new Error(data.message || t("error"));
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
        router.push("/");
      }
    } catch (error: any) {
      console.log("Registration Failed:", error);
      setError({ message: error.message });
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h1 className="mb-6 flex flex-col text-center text-2xl font-bold text-text-primary">
        {t("title")}
        <span className="text-secondary"> MyBudget</span>
      </h1>

      <TextField
        required
        label={tc("firstName")}
        value={state.firstName}
        onChange={onChange}
        name="firstName"
        hasError={Boolean(error.firstName?.length)}
        helperText={error.firstName}
        placeholder={tc("firstNamePlaceholder")}
        startAdornment={<UserCircleIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        label={tc("lastName")}
        value={state.lastName}
        onChange={onChange}
        name="lastName"
        placeholder={tc("lastNamePlaceholder")}
        startAdornment={<UserCircleIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        required
        label={tc("email")}
        value={state.email}
        onChange={onChange}
        name="email"
        hasError={Boolean(error.email?.length)}
        helperText={error.email}
        placeholder={tc("emailPlaceholder")}
        startAdornment={<AtSymbolIcon className="w-5 text-text-secondary" />}
      />

      <TextField
        required
        label={tc("password")}
        type="password"
        value={state.password}
        onChange={onChange}
        name="password"
        hasError={Boolean(error.password?.length)}
        helperText={error.password}
        placeholder={tc("passwordPlaceholder")}
        startAdornment={<KeyIcon className="w-5 text-text-secondary" />}
      />

      {error.message && (
        <p className="mt-2 text-sm text-red-500">{error.message}</p>
      )}

      <div>
        <div className="mt-[32px] flex items-center justify-between gap-4">
          <Button href="/login" className="w-full">
            <ArrowLeftIcon className="w-5 md:w-6" />
            {tb("back")}
          </Button>

          <Button type="submit" className="w-full">
            {t("registerBtn")}
          </Button>
        </div>
      </div>
    </form>
  );
}
