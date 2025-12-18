"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PublicUser } from "@/app/lib/definitions";

import { useAppForm } from "@/app/ui/components/Form";

import { createUserProfileSchema } from "@/app/lib/schema/userProfile.schema";

import { useUpdateUserMutation } from "../hooks/useUpdateUserMutation";

type Props = {
  userData: PublicUser;
};

export default function UserProfileForm({ userData }: Props) {
  const session = useSession();
  const router = useRouter();

  const t = useTranslations("UserProfile");
  const tc = useTranslations("Common.inputs");
  const ts = useTranslations("Common.selectors");
  const tv = useTranslations("FormValidations");

  const schema = createUserProfileSchema(tv);

  const { mutateAsync } = useUpdateUserMutation();

  const form = useAppForm({
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      avararURL: userData.avatarURL,
      defaultCurrency: userData.defaultCurrency,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        payload: {
          ...value,
          avatarURL: userData.avatarURL,
        },
      });

      session.update({ email: form.getFieldValue("email") });
      router.refresh();
    },
  });

  return (
    <div className="mx-auto mt-5 flex max-w-[360px] flex-col items-center justify-center">
      <form.AppForm>
        {userData.avatarURL && (
          <Image
            src={userData.avatarURL || ""}
            width={150}
            height={150}
            alt="avatar"
            className="mx-auto rounded-full"
          />
        )}

        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label={tc("firstName")} />}
        />

        <form.AppField
          name="lastName"
          children={(field) => <field.TextField label={tc("lastName")} />}
        />

        <h2 className="mt-8 text-center text-2xl font-semibold text-text-primary">
          {t("settings")}
        </h2>

        <form.AppField
          name="defaultCurrency"
          children={(field) => (
            <field.CurrencySeletcField label={ts("currencyLabel")} />
          )}
        />

        <div className="mt-8 flex gap-4">
          <form.CancelButton />
          <form.SubmitButton />
        </div>
      </form.AppForm>
    </div>
  );
}
