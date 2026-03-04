import dbConnect from "@/app/lib/db/mongodb";

import { ExchangeRate } from "../models";

export async function getTodayExchangeRates() {
  await dbConnect();

  const today = new Date().toISOString().split("T")[0];

  return ExchangeRate.findOne({ date: today });
}

export async function createTodayExchangeRates(dataRates: any) {
  await dbConnect();

  const today = new Date().toISOString().split("T")[0];

  return await ExchangeRate.create({
    base: dataRates.base,
    rates: dataRates.rates,
    date: today,
  });
}

export async function getLatestExchangeRates() {
  await dbConnect();

  return ExchangeRate.findOne().sort({ date: -1 });
}
