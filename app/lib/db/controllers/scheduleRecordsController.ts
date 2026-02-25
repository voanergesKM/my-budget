import mongoose from "mongoose";

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
    VehicleReminder.aggregate([
      {
        $match: {
          ...query,
          vehicle: new mongoose.Types.ObjectId(vehicleId),
        },
      },

      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "overdue"] }, then: 0 },
                { case: { $eq: ["$status", "due"] }, then: 1 },
                { case: { $eq: ["$status", "scheduled"] }, then: 2 },
                { case: { $eq: ["$status", "completed"] }, then: 3 },
                { case: { $eq: ["$status", "dismissed"] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      },

      {
        $sort: {
          statusOrder: 1,
          triggerDate: 1,
          triggerOdometer: 1,
        },
      },

      { $skip: skip },
      { $limit: pageSize },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "servicerecords",
          localField: "record",
          foreignField: "_id",
          as: "record",
        },
      },
      { $unwind: { path: "$record", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          statusOrder: 0,
        },
      },
    ]),

    VehicleReminder.countDocuments({
      ...query,
      vehicle: new mongoose.Types.ObjectId(vehicleId),
    }),
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

export async function refreshVehicleReminders(vehicle: any) {
  const { _id, currentOdometer = 0, reminderSettings } = vehicle;

  const defaultReminderSettings = reminderSettings.default ?? {
    dateGapDays: 14,
    odometerGapKm: 1000,
  };

  const vehicleId = new mongoose.Types.ObjectId(_id);

  const now = new Date();

  const dueDateBorder = new Date(
    now.getTime() + defaultReminderSettings.dateGapDays * 86400000
  );

  await VehicleReminder.updateMany(
    {
      vehicle: vehicleId,
      status: { $nin: ["completed", "dismissed"] },
    },
    [
      {
        $set: {
          status: {
            $switch: {
              branches: [
                // OVERDUE
                {
                  case: {
                    $or: [
                      {
                        $and: [
                          { $ne: ["$triggerDate", null] },
                          { $lte: ["$triggerDate", now] },
                        ],
                      },
                      {
                        $and: [
                          { $gt: ["$triggerOdometer", 0] },
                          { $lte: ["$triggerOdometer", currentOdometer] },
                        ],
                      },
                    ],
                  },
                  then: "overdue",
                },

                // DUE
                {
                  case: {
                    $or: [
                      {
                        $and: [
                          { $ne: ["$triggerDate", null] },
                          { $lte: ["$triggerDate", dueDateBorder] },
                          { $gt: ["$triggerDate", now] },
                        ],
                      },
                      {
                        $and: [
                          { $gt: ["$triggerOdometer", 0] },
                          {
                            $lte: [
                              "$triggerOdometer",
                              currentOdometer +
                                defaultReminderSettings.odometerGapKm,
                            ],
                          },
                          {
                            $gt: ["$triggerOdometer", currentOdometer],
                          },
                        ],
                      },
                    ],
                  },
                  then: "due",
                },
              ],
              default: "scheduled",
            },
          },
        },
      },
    ]
  );
}

const DATE_GAP_DAYS = 14;

export async function refreshRemindersByDate() {
  const now = new Date();
  const dueFrom = new Date(now.getTime() + DATE_GAP_DAYS * 86400000);

  await VehicleReminder.updateMany(
    {
      status: { $nin: ["completed", "dismissed"] },
      triggerDate: { $exists: true },
    },
    [
      {
        $set: {
          status: {
            $switch: {
              branches: [
                {
                  case: { $lte: ["$triggerDate", now] },
                  then: "overdue",
                },
                {
                  case: {
                    $and: [
                      { $gt: ["$triggerDate", now] },
                      { $lte: ["$triggerDate", dueFrom] },
                    ],
                  },
                  then: "due",
                },
              ],
              default: "scheduled",
            },
          },
        },
      },
    ]
  );
}
