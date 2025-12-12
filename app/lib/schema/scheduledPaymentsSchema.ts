import z from "zod";

export const createScheduledPaymentSchema = (
  t: (key: string, values?: any) => string
) => {
  return z.object({
    description: z.string().min(2, {
      message: t("baseRequired"),
    }),
    amount: z.coerce.number().min(0.01, {
      message: t("baseRequired"),
    }),
    currency: z.string().min(1, {
      message: t("currencyRequired"),
    }),
    category: z.string().min(1, {
      message: t("categoryRequired"),
    }),
    proceedDate: z.coerce.date(),
    skipNext: z.boolean(),
    frequency: z.enum([
      "daily",
      "weekly",
      "2weeks",
      "4weeks",
      "monthly",
      "annually",
    ]),
    status: z.enum(["active", "paused", "cancelled"]),
  });
};
