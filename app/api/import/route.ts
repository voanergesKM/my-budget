import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import { createBulkFuelRecords } from "@/app/lib/db/controllers/fuelRecordsController";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { createBulkServiceRecords } from "@/app/lib/db/controllers/serviceRecordsController";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { VehicleReminder } from "@/app/lib/db/models/VehicleReminder";
import { transactionService } from "@/app/lib/db/services";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";
import {
  mapFuelRowToTransaction,
  mapServiceRowToTransaction,
} from "@/app/lib/fuelio/mapFuelioRow";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);
  const tv = await withServerTranslations("");

  const payload = await req.json();
  const { vehicleId, sections, group, category, importedSectionsNames } =
    payload;

  const vehicle = await withAccessCheck(
    () => Vehicle.findById(vehicleId),
    currentUser,
    {
      getGroupId: (s) => s.group,
    }
  );

  if (!vehicle) throw new NotAuthorizedError();

  const currencyRates = await getTodayExchangeRates();

  let defaultCurrency = currentUser.defaultCurrency;

  if (group) {
    const targetGroup = await getGroupById(group, currentUser);
    defaultCurrency = targetGroup.defaultCurrency;
  }

  const imported = `fuelio-${new Date().toISOString()}`;

  const fuelTransactions: any[] = [];
  const fuelRecordsToInsert: any[] = [];

  const serviceTransactions: any[] = [];
  const serviceRecordsToInsert: any[] = [];

  const remindersToInsert: any[] = [];

  for (const section of sections) {
    const { name, createTransactions, records } = section;

    if (!records?.length) continue;

    if (name === "fuel") {
      await Vehicle.updateOne(
        { _id: vehicleId },
        { currentOdometer: records[0]?.odometer }
      );

      for (const record of records) {
        const amountInBaseCurrency =
          record.amount / currencyRates.rates.get(defaultCurrency);

        if (createTransactions && category) {
          const transactionPayload = mapFuelRowToTransaction(
            record,
            defaultCurrency,
            category,
            amountInBaseCurrency,
            imported
          );

          fuelTransactions.push(transactionPayload);
        }

        fuelRecordsToInsert.push({
          ...record,
          vehicle: vehicleId,
          transaction: null,
          currency: defaultCurrency,
          imported: imported,
        });
      }
    }

    if (name === "expenses") {
      for (const record of records) {
        const amountInBaseCurrency =
          record.amount / currencyRates.rates.get(defaultCurrency);

        if (createTransactions && category) {
          const transactionPayload = mapServiceRowToTransaction(
            tv,
            record,
            defaultCurrency,
            category,
            amountInBaseCurrency,
            imported
          );

          serviceTransactions.push(transactionPayload);
        }

        serviceRecordsToInsert.push({
          ...record,
          vehicle: vehicleId,
          currency: defaultCurrency,
          imported: imported,
          transaction: null,
        });
      }
    }
  }

  const createdFuelTransactions = fuelTransactions.length
    ? await transactionService.createMany(currentUser, group, fuelTransactions)
    : [];

  const createdServiceTransactions = serviceTransactions.length
    ? await transactionService.createMany(
        currentUser,
        group,
        serviceTransactions
      )
    : [];

  createdFuelTransactions.forEach((t, index) => {
    fuelRecordsToInsert[index].transaction = t._id;
  });

  createdServiceTransactions.forEach((t, index) => {
    serviceRecordsToInsert[index].transaction = t._id;
  });

  const createdFuelRecords = fuelRecordsToInsert.length
    ? await createBulkFuelRecords(currentUser, fuelRecordsToInsert)
    : [];

  const createdServiceRecords = serviceRecordsToInsert.length
    ? await createBulkServiceRecords(currentUser, serviceRecordsToInsert)
    : [];

  createdServiceRecords.forEach((record, index) => {
    const original = serviceRecordsToInsert[index];

    if (original.remind) {
      remindersToInsert.push({
        vehicle: vehicleId,
        createdBy: currentUser._id,
        record: record._id,
        title: record.title,
        triggerDate: original.remindAtDate,
        triggerOdometer: original.remindAtOdometer,
        imported: imported,
        category: original.category,
        createdAt: original.createdAt,
        status: "dismissed",
      });
    }
  });

  const createdReminders = remindersToInsert.length
    ? await VehicleReminder.insertMany(remindersToInsert)
    : [];

  return NextResponse.json(
    {
      success: true,
      data: {
        vehicleId,
        importedSectionsNames,
        fuelRecords: createdFuelRecords,
        transactions: [
          ...createdFuelTransactions,
          ...createdServiceTransactions,
        ],
        serviceRecords: createdServiceRecords,
        reminders: createdReminders,
      },
    },
    { status: 200 }
  );
});
