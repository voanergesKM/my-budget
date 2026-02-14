import mongoose from "mongoose";

import { User as UserType } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { FuelRecordType } from "@/app/lib/types/vehicle";

import dbConnect from "../mongodb";

export async function getFuelRecords(
  currentUser: UserType,
  vehicleId: string,
  page: number,
  pageSize: number
) {
  await dbConnect();

  await withAccessCheck(() => Vehicle.findById(vehicleId), currentUser, {
    getGroupId: (s) => s.group,
  });

  const skip = (page - 1) * pageSize;

  const query: Record<string, any> = { vehicle: vehicleId };

  const [list, totalCount] = await Promise.all([
    FuelRecord.find(query)
      .sort({ odometer: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate(["vehicle", "createdBy", "transaction"]),

    FuelRecord.countDocuments(query),
  ]);

  return {
    list,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasMore: page < Math.ceil(totalCount / pageSize),
  };
}

export async function createFuelRecord(
  currentUser: UserType,
  payload: Partial<FuelRecordType>
) {
  await dbConnect();

  return await FuelRecord.create({
    ...payload,
    createdBy: currentUser._id,
  });
}

export async function updateFuelRecord(
  recordId: string,
  payload: Partial<FuelRecordType>
) {
  await dbConnect();

  return FuelRecord.findByIdAndUpdate(recordId, payload);
}

export async function deleteFuelRecords(ids: string[]) {
  await dbConnect();

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const recordsToDelete = await FuelRecord.find({
      _id: { $in: ids },
    }).session(session);

    await FuelRecord.deleteMany({ _id: { $in: ids } }).session(session);

    const fullIds = new Set<string>();

    for (const record of recordsToDelete) {
      const nextFull = await FuelRecord.findOne({
        vehicle: record.vehicle,
        fullTank: true,
        odometer: { $gt: record.odometer },
      })
        .sort({ odometer: 1 })
        .session(session);

      if (nextFull) {
        fullIds.add(nextFull._id.toString());
      }
    }

    for (const id of fullIds) {
      await recalcConsumptionForFullTank(
        new mongoose.Types.ObjectId(id),
        session
      );
    }
  });
}

export async function recalcConsumptionForFullTank(
  fullId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession | null = null
) {
  const full = await FuelRecord.findById(fullId).session(session);
  if (!full || !full.fullTank) return;

  const vehicle = await Vehicle.findById(full.vehicle).session(session);
  if (!vehicle) return;

  const prevFull = await FuelRecord.findOne({
    vehicle: full.vehicle,
    fullTank: true,
    odometer: { $lt: full.odometer },
  })
    .sort({ odometer: -1 })
    .session(session);

  const startOdo = prevFull ? prevFull.odometer : vehicle.odometer;

  const fillsBetween = await FuelRecord.find({
    vehicle: full.vehicle,
    odometer: {
      $gt: startOdo,
      $lt: full.odometer,
    },
  }).session(session);

  const litersBetween = fillsBetween.reduce(
    (s, r) => s + Number(r.liters || 0),
    0
  );

  const trip = full.odometer - startOdo;

  if (trip <= 0) {
    await FuelRecord.findByIdAndUpdate(
      full._id,
      { consumption: null },
      { session }
    );
    return;
  }

  const totalLiters = litersBetween + Number(full.liters || 0);

  const consumption = (totalLiters / trip) * 100;

  await FuelRecord.findByIdAndUpdate(full._id, { consumption }, { session });
}
