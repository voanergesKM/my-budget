import { v4 as uuidv4 } from "uuid";

import { ExchangeRate, ScanedItem, Transaction } from "@/app/lib/definitions";

export function prepareTransactionsForSave(
  date: string,
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
      transaction.amount! += item.total;
      transaction.description += `, ${description}`;
      transaction.amountInBaseCurrency =
        (transaction.amountInBaseCurrency || 0) + amountInBaseCurrency;
      return acc;
    }

    acc.push({
      transientId: uuidv4(),
      description: description,
      amount: item.total,
      type: "outgoing",
      createdAt: date,
      currency: currency,
      category: item.category,
      amountInBaseCurrency: Number(amountInBaseCurrency.toFixed(2)),
    });
    return acc;
  }, [] as Partial<Transaction>[]);
}

function formatItemDescription(item: ScanedItem, currency: string) {
  return `${item.name} - ${item.quantity}/${item.total.toFixed(2)}-${currency}`;
}
