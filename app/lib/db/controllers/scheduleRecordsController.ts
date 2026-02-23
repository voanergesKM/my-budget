import { User as UserType } from "@/app/lib/definitions";

import { VehicleReminder } from "@/app/lib/db/models/VehicleReminder";
import { ScheduleRecordType, ServiceRecordType } from "@/app/lib/types/vehicle";

import dbConnect from "../mongodb";

export async function getScheduleRecords(
  currentUser: UserType,
  vehicleId: string,
  page: number,
  pageSize: number
) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query: Record<string, any> = { vehicle: vehicleId };

  const [list, totalCount] = await Promise.all([
    VehicleReminder.find(query)
      .sort({ triggerOdometer: -1, triggerDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate(["createdBy", "record"]),

    VehicleReminder.countDocuments(query),
  ]);

  return {
    list,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasMore: page < Math.ceil(totalCount / pageSize),
  };
}

export async function createScheduleRecord(
  currentUser: UserType,
  payload: Partial<ScheduleRecordType>
) {
  await dbConnect();

  return await VehicleReminder.create({
    ...payload,
    createdBy: currentUser._id,
  });
}

export async function updateScheduleRecord(
  recordId: string,
  payload: Partial<ServiceRecordType>
) {
  await dbConnect();

  return VehicleReminder.findByIdAndUpdate(recordId, payload, { new: true });
}

export async function deleteScheduleRecords(ids: string[]) {
  await dbConnect();

  return VehicleReminder.deleteMany({ _id: { $in: ids } });
}
