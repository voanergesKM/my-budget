import { v4 as uuidv4 } from "uuid";

import { ExchangeRate, ScanedItem, Transaction } from "@/app/lib/definitions";

type PreparedTransaction = {
  category: string;
  amount: number;
  description: string;
  amountInBaseCurrency: number;
};

export function prepareTransactionsForSave(
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
      // transientId: uuidv4(),
      description: description,
      amount: Number(item.total.toFixed(2)),
      // type: "outgoing",
      // createdAt: date,
      // currency: currency,
      category: item.category,
      amountInBaseCurrency: Number(amountInBaseCurrency.toFixed(2)),
    });
    return acc;
  }, [] as PreparedTransaction[]);
}

function formatItemDescription(item: ScanedItem, currency: string) {
  return `${item.name} - ${item.quantity}/${item.total.toFixed(2)}-${currency}`;
}
