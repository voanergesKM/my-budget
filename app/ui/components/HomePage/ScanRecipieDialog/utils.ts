import { v4 as uuidv4 } from "uuid";

import { ExchangeRate, ScanedItem, Transaction } from "@/app/lib/definitions";

export function prepareTransactionsForSave(
  date: string,
  items: ScanedItem[],
  currencyRates: ExchangeRate,
  currency: string
) {
  console.log("🚀 ~ prepareTransactionsForSave ~ items:", items);
  return items.reduce((acc, item) => {
    const amountInBaseCurrency =
      item.price! / currencyRates.rates[currency as string];

    const addedTransaction = acc.findIndex((t) => t.category === item.category);

    if (addedTransaction !== -1) {
      const transaction = acc[addedTransaction];
      transaction.amount! += item.price;
      transaction.description += `, ${item.name}`;
      transaction.amountInBaseCurrency =
        (transaction.amountInBaseCurrency || 0) + amountInBaseCurrency;
      return acc;
    }

    acc.push({
      transientId: uuidv4(),
      description: item.name,
      amount: item.price,
      type: "outgoing",
      createdAt: date,
      currency: currency,
      category: item.category,
      amountInBaseCurrency: Number(amountInBaseCurrency.toFixed(2)),
    });
    return acc;
  }, [] as Partial<Transaction>[]);
}
