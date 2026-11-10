import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import mongoose from "mongoose";
import { z } from "zod";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { SERVICE_CATEGORIES } from "@/app/lib/constants";
import { getTodayExchangeRates } from "@/app/lib/db/controllers/exchangeRateControllers";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Transaction } from "@/app/lib/db/models";
import { ServiceRecord } from "@/app/lib/db/models/ServiceRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import {
  ConflictError,
  NotAuthorizedError,
  ValidationError,
} from "@/app/lib/errors/customErrors";
import { mapServiceRowToTransaction } from "@/app/lib/fuelio/mapFuelioRow";

const batchSchema = z.object({
  batchId: z.string().uuid(),
  vehicleId: z.string().refine(mongoose.isValidObjectId),
  records: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(500),
        category: z
          .string()
          .refine((value) => SERVICE_CATEGORIES.includes(value)),
        amount: z.number().finite().min(1),
        notes: z.string().max(10000),
        odometer: z.number().finite().min(0),
        createdAt: z.string().datetime(),
      })
    )
    .min(1)
    .max(100),
});

const Batch =
  mongoose.models.ServiceRecordBatch ||
  mongoose.model(
    "ServiceRecordBatch",
    new mongoose.Schema(
      {
        _id: String,
        hash: { type: String, required: true },
      },
      { timestamps: true }
    )
  );

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);
  const parsed = batchSchema.safeParse(await req.json());
  if (!parsed.success) throw new ValidationError("Invalid service records");
  const { batchId, vehicleId, records } = parsed.data;
  const vehicle = await withAccessCheck(
    () => Vehicle.findById(vehicleId),
    currentUser,
    { getGroupId: (v) => v.group }
  );
  if (!vehicle) throw new NotAuthorizedError();
  const key = `${currentUser._id}:${batchId}`;
  const hash = createHash("sha256")
    .update(JSON.stringify({ vehicleId, records }))
    .digest("hex");
  const existing = (await Batch.findById(key).lean()) as {
    hash: string;
  } | null;
  if (existing) {
    if (existing.hash !== hash)
      throw new ConflictError("Batch ID already used with different records");
    return NextResponse.json({ success: true });
  }
  const defaultCurrency = vehicle.group
    ? (await getGroupById(vehicle.group, currentUser)).defaultCurrency
    : currentUser.defaultCurrency;
  const categories = records.map(
    (record) => vehicle.transactionCategories?.[record.category]
  );
  const hasTransactions = categories.some(Boolean);
  const rates = hasTransactions ? await getTodayExchangeRates() : null;
  const rate = rates?.rates.get(defaultCurrency);
  if (hasTransactions && (!rate || !Number.isFinite(rate)))
    throw new ValidationError("Currency rate is unavailable");
  const translate = await withServerTranslations("");
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Batch.create([{ _id: key, hash }], { session });
      const transactionIds = categories.map((category) =>
        category ? new mongoose.Types.ObjectId() : null
      );
      if (hasTransactions) {
        await Transaction.insertMany(
          records.flatMap((record, index) =>
            categories[index]
              ? [
                  {
                    ...mapServiceRowToTransaction(
                      translate,
                      record as any,
                      defaultCurrency,
                      categories[index],
                      record.amount / rate!,
                      undefined,
                      vehicle.distanceUnit ?? "km"
                    ),
                    _id: transactionIds[index],
                    createdBy: currentUser._id,
                    group: vehicle.group || undefined,
                  },
                ]
              : []
          ),
          { session }
        );
      }
      await ServiceRecord.insertMany(
        records.map((record, index) => ({
          ...record,
          vehicle: vehicleId,
          createdBy: currentUser._id,
          currency: defaultCurrency,
          transaction: transactionIds[index],
        })),
        { session }
      );
    });
  } catch (error) {
    // Concurrent retries may race on the batch ID; an already committed identical batch is success.
    const committed = (await Batch.findById(key).lean()) as {
      hash: string;
    } | null;
    if (!committed || committed.hash !== hash) throw error;
  } finally {
    await session.endSession();
  }
  return NextResponse.json({ success: true });
});
