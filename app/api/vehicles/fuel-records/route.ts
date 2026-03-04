import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import {
  createFuelRecord,
  deleteFuelRecords,
  getFuelRecords,
  recalcConsumptionForFullTank,
  updateFuelRecord,
} from "@/app/lib/db/controllers/fuelRecordsController";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { createTransaction } from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";
import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { transactionService } from "@/app/lib/db/services";
import {
  ConflictError,
  NotAuthorizedError,
} from "@/app/lib/errors/customErrors";
import { mapFuelRowToTransaction } from "@/app/lib/fuelio/mapFuelioRow";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get("vehicleId");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  if (vehicleId) {
    const list = await getFuelRecords(
      currentUser,
      vehicleId,
      page ? +page : 1,
      pageSize ? +pageSize : 10
    );

    return NextResponse.json({ success: true, data: list }, { status: 200 });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { deletedRecords, vehicleId } = await req.json();

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

  const transactionIds = deletedRecords
    .filter((r: { transactionId: string | null }) => r.transactionId)
    .map((r: { transactionId: string }) => r.transactionId);

  await transactionService.deleteMany(currentUser, transactionIds);

  const recordIds = deletedRecords.map((r: { recordId: string }) => r.recordId);

  const deleted = await deleteFuelRecords(recordIds);

  return NextResponse.json({ success: true, data: deleted }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);
  const t = await withServerTranslations("Notifications");

  const { record, vehicleId } = await req.json();

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

  if (record.isMissed && record.fullTank) {
    throw new ConflictError("Missed record cannot be full tank");
  }

  const isOdoExist = await FuelRecord.findOne(
    {
      odometer: record.odometer,
      vehicle: vehicle._id,
    },
    { _id: 1 }
  );

  if (!!isOdoExist) {
    const message = t("fuelRecordDuplicateOdometer");
    throw new ConflictError(message);
  }

  const vehicleObjectId = new mongoose.Types.ObjectId(vehicle._id);

  const currencyRates = await getTodayExchangeRates();
  let defaultCurrency = currentUser.defaultCurrency;

  if (vehicle.group) {
    const targetGroup = await getGroupById(vehicle.group, currentUser);
    defaultCurrency = targetGroup.defaultCurrency;
  }

  let transaction = null;

  if (vehicle.category) {
    const amountInBaseCurrency =
      record.amount / currencyRates.rates.get(defaultCurrency);

    const transactionPayload = mapFuelRowToTransaction(
      record,
      defaultCurrency,
      vehicle.category,
      amountInBaseCurrency
    );

    transaction = await createTransaction(
      currentUser,
      vehicle.group,
      transactionPayload
    );
  }

  let consumption = null;

  if (vehicle.currentOdometer < record.odometer) {
    if (record.fullTank) {
      const history = await FuelRecord.find({
        vehicle: vehicleObjectId,
        odometer: { $lt: record.odometer },
      })
        .sort({ odometer: -1 })
        .lean();

      let trip = record.trip;
      let liters = record.liters;

      for (const r of history) {
        if (!!r.fullTank) {
          break;
        }

        trip += r.trip;
        liters += r.liters;
      }

      consumption = (liters / trip) * 100;
    }

    await Vehicle.findByIdAndUpdate(vehicleId, {
      currentOdometer: record.odometer,
    });
  }

  const created = await createFuelRecord(currentUser, {
    ...record,
    vehicle: vehicleId,
    transaction: transaction?._id || null,
    currency: defaultCurrency,
    consumption,
  });

  if (record.isMissed) {
    const nextFull = await FuelRecord.findOne({
      vehicle: vehicleId,
      fullTank: true,
      odometer: { $gt: record.odometer },
    }).sort({ odometer: 1 });

    if (nextFull) {
      await recalcConsumptionForFullTank(nextFull._id);
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        transaction,
        created: created,
        consumption,
      },
    },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { record, vehicleId } = await req.json();

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

  let transaction = null;

  const currencyRates = await getTodayExchangeRates();

  if (record.transaction) {
    const amountInBaseCurrency =
      record.amount / currencyRates.rates.get(record.currency);

    const transactionPayload = mapFuelRowToTransaction(
      record,
      record.currency,
      vehicle.category,
      amountInBaseCurrency
    );

    transaction = await transactionService.updateOne(
      currentUser,
      record.transaction,
      transactionPayload
    );
  }

  let updated = null;

  if (record.fullTank) {
    const prevFull = await FuelRecord.findOne({
      vehicle: vehicleId,
      fullTank: true,
      odometer: { $lt: record.odometer },
    }).sort({ odometer: -1 });

    const startOdo = prevFull ? prevFull.odometer : vehicle.odometer;

    const fillsBetween = await FuelRecord.find({
      vehicle: vehicleId,
      odometer: {
        $gt: startOdo,
        $lt: record.odometer,
      },
    });

    const litersBetween = fillsBetween.reduce((s, r) => s + r.liters, 0);
    const trip = record.odometer - startOdo;

    const totalLiters = litersBetween + record.liters;

    const consumption = (totalLiters / trip) * 100;

    updated = await updateFuelRecord(record._id, { ...record, consumption });
  } else {
    updated = await updateFuelRecord(record._id, record);

    const nextFull = await FuelRecord.findOne({
      vehicle: vehicleId,
      fullTank: true,
      odometer: { $gt: record.odometer },
    }).sort({ odometer: 1 });

    if (nextFull) {
      await recalcConsumptionForFullTank(nextFull._id);
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        transaction,
        record: updated,
      },
    },
    { status: 200 }
  );
});
