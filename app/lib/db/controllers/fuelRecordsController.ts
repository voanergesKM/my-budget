import mongoose from "mongoose";

import { User as UserType } from "@/app/lib/definitions";
import { buildSearchQuery } from "@/app/lib/utils/searchQuery";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { FuelRecordType } from "@/app/lib/types/vehicle";
import { affectedFullTankIds } from "@/app/lib/vehicle/fuelConsumption";
import { consumptionLitersPer100Km } from "@/app/lib/vehicle/units";

import dbConnect from "../mongodb";

export async function getFuelRecords(
  currentUser: UserType,
  vehicleId: string,
  page: number,
  pageSize: number,
  search?: string | null
) {
  await dbConnect();

  await withAccessCheck(() => Vehicle.findById(vehicleId), currentUser, {
    getGroupId: (s) => s.group,
  });

  const skip = (page - 1) * pageSize;

  const query: Record<string, any> = {
    vehicle: vehicleId,
    ...buildSearchQuery(search, ["station", "city", "notes"]),
  };

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

export const createBulkFuelRecords = async (
  currentUser: UserType,
  records: Partial<FuelRecordType>[]
) => {
  await dbConnect();

  const payload = records.map((t) => ({
    ...t,
    createdBy: currentUser._id,
  }));

  return FuelRecord.insertMany(payload);
};

export async function updateFuelRecord(
  recordId: string,
  payload: Partial<FuelRecordType>
) {
  await dbConnect();

  return FuelRecord.findByIdAndUpdate(recordId, payload, { new: true });
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

  // An initial vehicle odometer does not establish the tank's fuel level.
  if (!prevFull) {
    await FuelRecord.findByIdAndUpdate(
      full._id,
      { consumption: null },
      { session }
    );
    return null;
  }
  const startOdo = prevFull.odometer;

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

  if (
    ![...fillsBetween, full].every(
      (record) => Number.isFinite(record.liters) && record.liters > 0
    )
  ) {
    await FuelRecord.findByIdAndUpdate(
      full._id,
      { consumption: null },
      { session }
    );
    return null;
  }

  const trip = full.odometer - startOdo;

  if (trip <= 0) {
    await FuelRecord.findByIdAndUpdate(
      full._id,
      { consumption: null },
      { session }
    );
    return null;
  }

  const totalLiters = litersBetween + Number(full.liters || 0);

  const consumption = consumptionLitersPer100Km(
    trip,
    totalLiters,
    vehicle.distanceUnit ?? "km",
    vehicle.fuelUnit ?? "l"
  );

  await FuelRecord.findByIdAndUpdate(full._id, { consumption }, { session });
  return consumption;
}

/** Recompute only intervals closed by imports or affected by their insertion. */
export async function recalcImportedFuelConsumption(
  vehicleId: string,
  imported: {
    _id: mongoose.Types.ObjectId;
    odometer: number;
    fullTank: boolean;
  }[]
) {
  const fullTanks = await FuelRecord.find({
    vehicle: vehicleId,
    fullTank: true,
  })
    .select("odometer")
    .sort({ odometer: 1 })
    .lean();
  const ids = affectedFullTankIds(
    imported.map((record) => ({
      id: record._id.toString(),
      odometer: record.odometer,
      fullTank: record.fullTank,
    })),
    fullTanks.map((record) => ({
      id: String(record._id),
      odometer: record.odometer,
    }))
  );
  for (const id of ids)
    await recalcConsumptionForFullTank(new mongoose.Types.ObjectId(id));
}
