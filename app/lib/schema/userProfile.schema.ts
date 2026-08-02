import z from "zod";

import { COLOR_SCHEME_VALUES } from "../constants/themeOptions";

export const createUserProfileSchema = (t: (key: string) => string) => {
  return z.object({
    firstName: z.string().min(2, {
      message: t("baseRequired"),
    }),
    lastName: z.string().min(2, {
      message: t("baseRequired"),
    }),
    email: z.string().email({
      message: t("invalidEmail"),
    }),
    avatarURL: z.string(),
    defaultCurrency: z.string().min(1, {
      message: t("currencyRequired"),
    }),
    colorScheme: z.enum(COLOR_SCHEME_VALUES),
  });
};
