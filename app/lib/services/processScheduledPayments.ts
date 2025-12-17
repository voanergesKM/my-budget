import mongoose from "mongoose";

import { getLatestExchangeRates } from "../db/controllers/exchangeRateControllers";
import ScheduledPayment from "../db/models/ScheduledPayment";
import ScheduledPaymentHistory from "../db/models/ScheduledPaymentHistory";
import Transaction from "../db/models/Transaction";
import { ExchangeRate } from "../definitions";
import { getNextProceedDate } from "../utils/getNextProceedDate";

export async function processScheduledPayments(date: Date) {
  const startOfDayUTC = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  const payments = await ScheduledPayment.find({
    proceedDate: startOfDayUTC,
    $or: [{ lastExecutedAt: null }, { lastExecutedAt: { $lt: startOfDayUTC } }],
  });

  const currencyRates: ExchangeRate = await getLatestExchangeRates();

  for (const payment of payments) {
    await processSinglePaymentWithHistory(payment, date, currencyRates);
  }
}

async function processSinglePaymentWithHistory(
  payment: any,
  now: Date,
  currencyRates: ExchangeRate
) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await processSinglePayment(payment, now, currencyRates, session);

    await session.commitTransaction();
  } catch (err: any) {
    console.error("❌ Scheduled payment failed", {
      paymentId: payment._id.toString(),
      error: err,
    });

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    await ScheduledPaymentHistory.create({
      scheduledPayment: payment._id,
      action: "error",
      errorMessage: err?.message ?? "Unknown error",
      proceedDate: payment.proceedDate,
    });
  } finally {
    session.endSession();
  }
}

type PaymentExecutionResult = {
  action: "skipped" | "executed" | "error";
  transactionId?: mongoose.Types.ObjectId;
};

async function processSinglePayment(
  payment: any,
  now: Date,
  currencyRates: ExchangeRate,
  session: mongoose.ClientSession
) {
  const {
    _id,
    description,
    amount,
    currency,
    category,
    createdBy,
    group,
    skipNext,
    frequency,
    proceedDate,
  } = payment;

  const rates =
    currencyRates.rates instanceof Map
      ? Object.fromEntries(currencyRates.rates)
      : currencyRates.rates;

  const rate = rates[currency];

  if (!rate) {
    throw new Error(`Missing exchange rate for currency: ${currency}`);
  }

  const amountInBaseCurrency = amount / rate;

  const nextProceedDate = getNextProceedDate(proceedDate, frequency);

  let result: PaymentExecutionResult;

  if (skipNext) {
    result = { action: "skipped" };
  } else {
    const [transaction] = await Transaction.create(
      [
        {
          description,
          amount,
          currency,
          category,
          createdBy,
          group,
          type: "outgoing",
          amountInBaseCurrency,
        },
      ],
      { session }
    );

    result = {
      action: "executed",
      transactionId: transaction._id,
    };
  }

  await ScheduledPayment.findByIdAndUpdate(
    _id,
    {
      status: "active",
      proceedDate: nextProceedDate,
      lastExecutedAt: now,
      ...(skipNext && { skipNext: false }),
    },
    { session }
  );

  await ScheduledPaymentHistory.create(
    [
      {
        scheduledPayment: _id,
        transaction: result.transactionId,
        action: result.action,
        proceedDate,
        nextProceedDate,
      },
    ],
    { session }
  );
}
