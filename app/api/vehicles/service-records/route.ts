import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { Transaction } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import {
  createServiceRecord,
  deleteServiceRecords,
  getServiceRecords,
  updateServiceRecord,
} from "@/app/lib/db/controllers/serviceRecordsController";
import { createTransaction } from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { VehicleReminder } from "@/app/lib/db/models/VehicleReminder";
import { transactionService } from "@/app/lib/db/services";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";
import { mapServiceRowToTransaction } from "@/app/lib/fuelio/mapFuelioRow";
import { ServiceRecordType } from "@/app/lib/types/vehicle";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get("vehicleId");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  if (vehicleId) {
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

    const list = await getServiceRecords(
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

  const deleted = await deleteServiceRecords(recordIds);

  return NextResponse.json({ success: true, data: deleted }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const t = await withServerTranslations("Notifications");
  const tv = await withServerTranslations("");

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

  const vehicleObjectId = new mongoose.Types.ObjectId(vehicle._id);

  const currencyRates = await getTodayExchangeRates();
  let defaultCurrency = currentUser.defaultCurrency;

  if (vehicle.group) {
    const targetGroup = await getGroupById(vehicle.group, currentUser);
    defaultCurrency = targetGroup.defaultCurrency;
  }

  const response = {
    created: null,
    transaction: null,
    remind: null,
  } as {
    created: null | ServiceRecordType;
    transaction: null | Transaction;
    remind: null;
  };

  if (vehicle.category) {
    const amountInBaseCurrency =
      record.amount / currencyRates.rates.get(defaultCurrency);

    const transactionPayload = mapServiceRowToTransaction(
      tv,
      record,
      defaultCurrency,
      vehicle.category,
      amountInBaseCurrency
    );

    response.transaction = await createTransaction(
      currentUser,
      vehicle.group,
      transactionPayload
    );
  }

  response.created = await createServiceRecord(currentUser, {
    ...record,
    vehicle: vehicleId,
    transaction: response.transaction?._id || null,
    currency: defaultCurrency,
  });

  if (record.remind) {
    response.remind = await VehicleReminder.create({
      vehicle: vehicleId,
      createdBy: currentUser._id,
      record: response.created?._id,
      title: record.title,
      triggerDate: record.remindAtDate,
      triggerOdometer: record.remindAtOdometer,
    });
  }

  return NextResponse.json(
    {
      data: response,
      success: true,
    },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);
  const tv = await withServerTranslations("");

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

  const response = {
    updated: null,
    transaction: null,
  } as {
    updated: null | ServiceRecordType;
    transaction: null | Transaction;
  };

  const currencyRates = await getTodayExchangeRates();

  if (record.transaction) {
    const amountInBaseCurrency =
      record.amount / currencyRates.rates.get(record.currency);

    const transactionPayload = mapServiceRowToTransaction(
      tv,
      record,
      record.currency,
      vehicle.category,
      amountInBaseCurrency
    );

    response.transaction = await transactionService.updateOne(
      currentUser,
      record.transaction,
      transactionPayload
    );
  }

  response.updated = await updateServiceRecord(record._id, record);

  return NextResponse.json(
    {
      success: true,
      data: response,
    },
    { status: 200 }
  );
});
