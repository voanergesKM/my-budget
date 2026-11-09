import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import {
  createBulkFuelRecords,
  recalcImportedFuelConsumption,
} from "@/app/lib/db/controllers/fuelRecordsController";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { createBulkServiceRecords } from "@/app/lib/db/controllers/serviceRecordsController";
import { getUser } from "@/app/lib/db/controllers/userController";
import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { VehicleReminder } from "@/app/lib/db/models/VehicleReminder";
import { transactionService } from "@/app/lib/db/services";
import {
  NotAuthorizedError,
  ValidationError,
} from "@/app/lib/errors/customErrors";
import {
  mapFuelRowToTransaction,
  mapServiceRowToTransaction,
} from "@/app/lib/fuelio/mapFuelioRow";
import { convertDistance, convertFuel } from "@/app/lib/vehicle/units";

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);
  const tv = await withServerTranslations("");

  const payload = await req.json();
  const { vehicleId, sections, importedSectionsNames } = payload;

  const vehicle = await withAccessCheck(
    () => Vehicle.findById(vehicleId),
    currentUser,
    {
      getGroupId: (s) => s.group,
    }
  );

  if (!vehicle) throw new NotAuthorizedError();

  // Fuelio Costs does not identify an odometer unit; avoid mixing distances.
  if (
    (vehicle.distanceUnit ?? "km") === "mi" &&
    sections.some(
      (section: any) =>
        section.name === "expenses" &&
        section.records?.some(
          (record: any) => record.odometer || record.remindAtOdometer
        )
    )
  ) {
    throw new ValidationError(
      "Fuelio expense odometer unit is unknown; import expenses without mileage or use a kilometer vehicle"
    );
  }

  const currencyRates = await getTodayExchangeRates();

  let defaultCurrency = currentUser.defaultCurrency;

  const group = vehicle.group;
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
      for (const sourceRecord of records) {
        const record = {
          ...sourceRecord,
          odometer: convertDistance(
            sourceRecord.odometer,
            "km",
            vehicle.distanceUnit ?? "km"
          ),
          trip: Number.isFinite(sourceRecord.trip)
            ? convertDistance(
                sourceRecord.trip,
                "km",
                vehicle.distanceUnit ?? "km"
              )
            : sourceRecord.trip,
          liters: convertFuel(
            sourceRecord.liters,
            "l",
            vehicle.fuelUnit ?? "l"
          ),
        };
        const amountInBaseCurrency =
          record.amount / currencyRates.rates.get(defaultCurrency);

        const category = vehicle.transactionCategories?.fuel;
        if (createTransactions && category) {
          const transactionPayload = mapFuelRowToTransaction(
            record,
            defaultCurrency,
            category,
            amountInBaseCurrency,
            imported,
            {
              distanceUnit: vehicle.distanceUnit ?? "km",
              fuelUnit: vehicle.fuelUnit ?? "l",
            }
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

        const category = vehicle.transactionCategories?.[record.category];
        if (createTransactions && category) {
          const transactionPayload = mapServiceRowToTransaction(
            tv,
            record,
            defaultCurrency,
            category,
            amountInBaseCurrency,
            imported,
            vehicle.distanceUnit ?? "km"
          );

          serviceTransactions.push({
            payload: transactionPayload,
            recordIndex: serviceRecordsToInsert.length,
          });
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
        serviceTransactions.map((item) => item.payload)
      )
    : [];

  createdFuelTransactions.forEach((t, index) => {
    fuelRecordsToInsert[index].transaction = t._id;
  });

  createdServiceTransactions.forEach((t, index) => {
    serviceRecordsToInsert[serviceTransactions[index].recordIndex].transaction =
      t._id;
  });

  let createdFuelRecords = fuelRecordsToInsert.length
    ? await createBulkFuelRecords(currentUser, fuelRecordsToInsert)
    : [];

  if (createdFuelRecords.length) {
    const odometers = createdFuelRecords
      .map((record: any) => record.odometer)
      .filter((odometer: number) => Number.isFinite(odometer) && odometer >= 0);
    if (odometers.length) {
      await Vehicle.updateOne(
        { _id: vehicleId },
        {
          $max: {
            currentOdometer: odometers.reduce(
              (max: number, odometer: number) => Math.max(max, odometer),
              0
            ),
          },
        }
      );
    }
    await recalcImportedFuelConsumption(vehicleId, createdFuelRecords);
    createdFuelRecords = await FuelRecord.find({
      _id: { $in: createdFuelRecords.map((record: any) => record._id) },
    });
  }

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
