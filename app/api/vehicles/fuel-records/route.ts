import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import {
  createFuelRecord,
  deleteFuelRecords,
  getFuelRecords,
  updateFuelRecord,
} from "@/app/lib/db/controllers/fuelRecordsController";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/app/lib/db/controllers/transactionControllers";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";
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

  if (transactionIds.length) {
    for (const transactionId of transactionIds) {
      await deleteTransaction(currentUser, transactionId);
    }
  }

  const recordIds = deletedRecords.map((r: { recordId: string }) => r.recordId);

  const deleted = await deleteFuelRecords(recordIds);

  return NextResponse.json({ success: true, data: deleted }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
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

  const created = await createFuelRecord(currentUser, {
    ...record,
    vehicle: vehicleId,
    transaction: transaction?._id || null,
    currency: defaultCurrency,
  });

  if (vehicle.currentOdometer < record.odometer) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      currentOdometer: record.odometer,
    });
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        transaction,
        record: created,
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

  if (record.transaction) {
    const transactionPayload = mapFuelRowToTransaction(record);

    transaction = await updateTransaction(
      currentUser,
      record.transaction,
      transactionPayload
    );
  }

  const updated = await updateFuelRecord(record._id, record);

  if (vehicle.currentOdometer < record.odometer) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      currentOdometer: record.odometer,
    });
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
