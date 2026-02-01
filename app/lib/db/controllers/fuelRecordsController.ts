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

  return FuelRecord.deleteMany({ _id: { $in: ids } });
}
