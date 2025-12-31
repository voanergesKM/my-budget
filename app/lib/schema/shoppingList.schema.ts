import z from "zod";

export const createShoppingSchema = (
  t: (key: string, values?: any) => string
) => {
  return z.object({
    title: z.string().min(1, {
      message: t("baseRequired"),
    }),
    completed: z.boolean(),
    items: z.array(createShoppingItemSchema(t)).min(1, {
      message: t("shoppingItemsRequired"),
    }),
  });
};

export const createShoppingItemSchema = (
  t: (key: string, values?: any) => string
) => {
  return z.object({
    id: z.string(),
    title: z.string().min(1, { message: t("baseRequired") }),
    unit: z.string().min(1, { message: t("baseRequired") }),
    quantity: z.coerce.number().min(1, { message: t("baseRequired") }),
    completed: z.boolean(),
    category: z.string(),
    amount: z.coerce.number().min(1, { message: t("baseRequired") }),
  });
};

export type ShoppingFormValues = z.infer<
  ReturnType<typeof createShoppingSchema>
>;
