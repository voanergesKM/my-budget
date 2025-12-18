import z from "zod";

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
    avararURL: z.string().nullable(),
    defaultCurrency: z.string().min(1, {
      message: t("currencyRequired"),
    }),
  });
};
