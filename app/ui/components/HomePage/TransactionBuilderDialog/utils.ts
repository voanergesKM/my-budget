import z from "zod";

import {
  ExchangeRate,
  ScanedItem,
  ShoppingItem,
  Transaction,
} from "@/app/lib/definitions";
import { getFormattedAmount } from "@/app/lib/utils/getFormattedAmount";

import { createSimpleTransactionSchema } from "@/app/lib/schema/transaction.schema";

type PreparedTransaction = {
  category: string;
  amount: number;
  description: string;
  amountInBaseCurrency: number;
};

export function prepareScannedTransactionsForSave(
  items: ScanedItem[],
  currencyRates: ExchangeRate,
  currency: string
) {
  return items.reduce((acc, item) => {
    const amountInBaseCurrency =
      item.total! / currencyRates.rates[currency as string];

    const description = formatItemDescription(item, currency);

    const addedTransaction = acc.findIndex((t) => t.category === item.category);

    if (addedTransaction !== -1) {
      const transaction = acc[addedTransaction];
      transaction.amount = Number(
        (transaction.amount! + item.total).toFixed(2)
      );
      transaction.description += `, ${description}`;
      transaction.amountInBaseCurrency = Number(
        (
          (transaction.amountInBaseCurrency || 0) + amountInBaseCurrency
        ).toFixed(2)
      );
      return acc;
    }

    acc.push({
      description: description,
      amount: Number(item.total.toFixed(2)),
      category: item.category,
      amountInBaseCurrency: Number(amountInBaseCurrency.toFixed(2)),
    });
    return acc;
  }, [] as PreparedTransaction[]);
}

export function prepareTransactionsFromShoppingItems(
  shoppingItems: ShoppingItem[],
  currencyRates: ExchangeRate,
  currency: string,
  t: (key: string, values?: any) => string
) {
  const groupedTransactions = Object.entries(
    Object.groupBy(shoppingItems, (item) => item.category)
  ).filter(([_, groupItems]) => groupItems !== undefined) as [
    string,
    ShoppingItem[],
  ][];

  return groupedTransactions.map(([category, items]) => {
    const amount = getTotalAmount(items);

    const amountInBaseCurrency =
      amount / currencyRates.rates[currency as string];

    return {
      category: category,
      amount,
      description: formatShoppingDescription(items, currency, t),
      amountInBaseCurrency,
      items: items.map((item) => item._id),
    };
  });
}

function formatItemDescription(item: ScanedItem, currency: string) {
  return `${item.name}: ${item.quantity} — ${getFormattedAmount(currency, item.total)}`;
}

function formatShoppingDescription(
  items: ShoppingItem[],
  currency: string,
  t: (key: string, values?: any) => string
) {
  return (
    items
      ?.map(
        (i) =>
          `${i.title}: ${i.quantity} ${t(i.unit, { count: i.quantity })} — ${getFormattedAmount(currency, i.amount)}`
      )
      .join(", ") ?? ""
  );
}

export function getTotalAmount(items: Partial<Transaction>[]) {
  return items.reduce((acc, item) => acc + (item.amount || 0), 0);
}

export function createValidationSchema(
  t: (key: string, values?: any) => string
) {
  return z.object({
    createdAt: z.coerce.date(),
    time: z.string(),
    type: z.enum(["incoming", "outgoing"]),
    currency: z.string(),
    totalAmount: z.number(),

    transactions: z.array(createSimpleTransactionSchema(t)),
  });
}
