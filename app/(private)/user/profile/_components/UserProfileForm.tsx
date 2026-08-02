"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { ColorScheme, PublicUser } from "@/app/lib/definitions";

import { useAppForm } from "@/app/ui/components/Form";

import { COLOR_SCHEME_OPTIONS } from "@/app/lib/constants/themeOptions";
import { createUserProfileSchema } from "@/app/lib/schema/userProfile.schema";
import { useColorScheme } from "@/app/ui/context/ColorSchemeContext";

import { useUpdateUserMutation } from "../hooks/useUpdateUserMutation";

type Props = {
  userData: PublicUser;
};

export default function UserProfileForm({ userData }: Props) {
  const session = useSession();
  const router = useRouter();
  const { setColorScheme } = useColorScheme();

  const t = useTranslations("UserProfile");
  const tc = useTranslations("Common.inputs");
  const ts = useTranslations("Common.selectors");
  const tv = useTranslations("FormValidations");
  const tcT = useTranslations("ColorTheme");

  const schema = createUserProfileSchema(tv);

  const { mutateAsync } = useUpdateUserMutation();

  const form = useAppForm({
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      avatarURL: userData.avatarURL || "",
      defaultCurrency: userData.defaultCurrency,
      colorScheme: (userData.colorScheme ?? "default") as ColorScheme,
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

      if (value.colorScheme) {
        setColorScheme(value.colorScheme);
      }

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

        {/* Color Scheme Selector */}
        <form.AppField
          name="colorScheme"
          children={(field) => (
            <div className="mt-4 w-full">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                {ts("colorSchemeLabel")}
              </label>
              <div className="flex gap-3">
                {COLOR_SCHEME_OPTIONS.map((opt) => {
                  const isSelected = field.state.value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      id={`color-scheme-${opt.value}`}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        field.handleChange(opt.value);
                        setColorScheme(opt.value);
                      }}
                      className={`flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-3 py-3 transition-all duration-200 ${
                        isSelected
                          ? "border-text-primary shadow-md"
                          : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${opt.primary} 0%, ${opt.secondary} 100%)`,
                      }}
                    >
                      <span className="text-xs font-semibold text-white drop-shadow">
                        {tcT(opt.value)}
                      </span>
                      <div className="flex gap-1">
                        <span
                          className="h-3 w-3 rounded-full border border-white/40"
                          style={{ background: opt.primary }}
                        />
                        <span
                          className="h-3 w-3 rounded-full border border-white/40"
                          style={{ background: opt.secondary }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
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
