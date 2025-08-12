import {
  createTodayExchangeRates,
  getTodayExchangeRates,
} from "@/app/lib/db/controllers/exchangeRateControllers";

export async function updateRatesForToday() {
  const todayExchanges = await getTodayExchangeRates();

  if (todayExchanges) return todayExchanges;

  const res = await fetch(
    `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_KEY}`
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error("Cannot fetch exchange rates");
  }

  const exchangeRate = await createTodayExchangeRates(data);
  return exchangeRate;
}
