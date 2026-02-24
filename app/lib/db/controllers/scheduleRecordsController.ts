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

const DUE_DAYS_GAP = 14;
const DUE_KM_GAP = 1000;

export async function refreshVehicleReminders(
  vehicleId: string,
  currentOdometer: number
) {
  const now = new Date();

  const dueDateBorder = new Date(
    now.getTime() + DUE_DAYS_GAP * 24 * 60 * 60 * 1000
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
                          { $ne: ["$triggerOdometer", null] },
                          { $lte: ["$triggerOdometer", currentOdometer] },
                        ],
                      },
                    ],
                  },
                  then: "overdue",
                },

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
                          { $ne: ["$triggerOdometer", null] },
                          {
                            $lte: [
                              "$triggerOdometer",
                              currentOdometer + DUE_KM_GAP,
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
