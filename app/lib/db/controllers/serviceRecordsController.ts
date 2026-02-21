import { User as UserType } from "@/app/lib/definitions";

import { ServiceRecord } from "@/app/lib/db/models/ServiceRecord";
import { ServiceRecordType } from "@/app/lib/types/vehicle";

import dbConnect from "../mongodb";

export async function getServiceRecords(
  currentUser: UserType,
  vehicleId: string,
  page: number,
  pageSize: number
) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query: Record<string, any> = { vehicle: vehicleId };

  const [list, totalCount] = await Promise.all([
    ServiceRecord.find(query)
      .sort({ odometer: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate(["createdBy"]),

    ServiceRecord.countDocuments(query),
  ]);

  return {
    list,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasMore: page < Math.ceil(totalCount / pageSize),
  };
}

export async function createServiceRecord(
  currentUser: UserType,
  payload: Partial<ServiceRecordType>
) {
  await dbConnect();

  return await ServiceRecord.create({
    ...payload,
    createdBy: currentUser._id,
  });
}

export async function updateServiceRecord(
  recordId: string,
  payload: Partial<ServiceRecordType>
) {
  await dbConnect();

  return ServiceRecord.findByIdAndUpdate(recordId, payload);
}

export async function deleteServiceRecords(ids: string[]) {
  await dbConnect();

  return ServiceRecord.deleteMany({ _id: { $in: ids } });
}
