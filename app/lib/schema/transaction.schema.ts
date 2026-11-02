import z from "zod";

export const createTransactionSchema = (
  t: (key: string, values?: any) => string
) => {
  return z.object({
    type: z.enum(["outgoing", "incoming"]),
    createdAt: z.coerce.date(),
    category: z.string().min(1, {
      message: t("categoryRequired"),
    }),
    amount: z.coerce.number().min(0.01, {
      message: t("baseRequired"),
    }),
    currency: z.string().min(1, {
      message: t("currencyRequired"),
    }),
    description: z.string().max(500),
    amountInBaseCurrency: z.number().optional(),
  });
};

export const validateTransactionForm = (
  schema: z.ZodTypeAny,
  value: unknown
) => {
  const result = schema.safeParse(value);
  if (result.success) return;

  const fields: Record<string, { message: string }[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (path) (fields[path] ??= []).push({ message: issue.message });
  }

  return {
    form: result.error.issues.map((issue) => issue.message).join("\n"),
    fields,
  };
};

export const createSimpleTransactionSchema = (
  t: (key: string, values?: any) => string
) => {
  return z.object({
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: t("categoryRequired"),
    }),
    amount: z.coerce.number().min(0.01, {
      message: t("baseRequired"),
    }),
    description: z.string(),
    amountInBaseCurrency: z.number(),
  });
};
