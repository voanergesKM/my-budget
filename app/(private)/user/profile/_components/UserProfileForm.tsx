"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PublicUser } from "@/app/lib/definitions";

import { updateUser } from "@/app/lib/api/user/updateUser";

import { Button } from "@/app/ui/shadcn/Button";

import {
  CurrencyOption,
  CurrencySelect,
} from "@/app/ui/components/CurrencySelect";
import { TextField } from "@/app/ui/components/TextField";

type ProfilePropsType = {
  userData: PublicUser;
};

export default function UserProfileForm({ userData }: ProfilePropsType) {
  const session = useSession();
  const router = useRouter();

  const t = useTranslations("UserProfile");
  const tc = useTranslations("Common.inputs");

  const [formValues, setFormValues] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    defaultCurrency: userData.defaultCurrency,
  });

  const [state, formAction, pending] = useActionState(updateUser, formValues);

  useEffect(() => {
    if (!!state?.success && !pending) {
      session.update({ email: state.data.email });
      router.refresh();
    }
  }, [pending, state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCurrencyChange = (option: string | CurrencyOption | null) => {
    if (typeof option === "string") {
    } else if (option) {
      setFormValues((prev) => ({ ...prev, defaultCurrency: option.value }));
    }
  };

  return (
    <div className="mt-[20px]">
      {userData.avatarURL && (
        <Image
          src={userData.avatarURL || ""}
          width={150}
          height={150}
          alt="avatar"
          className="mx-auto rounded-full"
        />
      )}

      <form action={formAction}>
        <div className="mt-4 flex flex-wrap justify-center gap-8">
          <TextField
            required
            label={tc("firstName")}
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            classes={{ root: "w-full xl:w-1/3" }}
          />
          <TextField
            label={tc("lastName")}
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            classes={{ root: "w-full xl:w-1/3" }}
          />
        </div>

        <h2 className="mt-8 text-center text-2xl font-semibold text-text-primary">
          {t("settings")}
        </h2>

        <div className="mt-4 flex justify-center">
          <input
            type="hidden"
            name="defaultCurrency"
            value={formValues.defaultCurrency}
          />
          <CurrencySelect
            value={formValues.defaultCurrency}
            onChange={handleCurrencyChange}
            className="w-[250px]"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            color="primary"
            disabled={pending}
            isLoading={pending}
            size={"lg"}
          >
            {t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
