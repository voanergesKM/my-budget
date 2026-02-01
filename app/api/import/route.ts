import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import { createFuelRecord } from "@/app/lib/db/controllers/fuelRecordsController";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { createTransaction } from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";
import { mapFuelRowToTransaction } from "@/app/lib/fuelio/mapFuelioRow";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

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

  if (!vehicle) {
    throw new NotAuthorizedError();
  }

  const currencyRates = await getTodayExchangeRates();

  let defaultCurrency = currentUser.defaultCurrency;

  if (group) {
    const targetGroup = await getGroupById(group, currentUser);
    defaultCurrency = targetGroup.defaultCurrency;
  }

  let fuelRecords = [];
  let transactions = [];

  for (const section of sections) {
    const { name, createTransactions, records } = section;

    await Vehicle.findById(vehicleId).updateOne({
      currentOdometer: records.at(0)?.odometer,
    });

    if (name === "fuel") {
      for (const record of records) {
        let transaction = null;

        const amountInBaseCurrency =
          record.amount / currencyRates.rates.get(defaultCurrency);

        if (createTransactions && category) {
          const transactionPayload = mapFuelRowToTransaction(
            record,
            defaultCurrency,
            category,
            amountInBaseCurrency,
            "fuelio"
          );

          transaction = await createTransaction(
            currentUser,
            group,
            transactionPayload
          );
          transactions.push(transaction);
        }

        const fuelRecord = await createFuelRecord(currentUser, {
          ...record,
          vehicle: vehicleId,
          transaction: transaction?._id || null,
          currency: defaultCurrency,
        });
        fuelRecords.push(fuelRecord);
      }
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: { vehicleId, importedSectionsNames, fuelRecords, transactions },
    },
    { status: 200 }
  );
});
