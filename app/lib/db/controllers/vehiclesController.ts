import { User as UserType } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import {
  buildVehicleExpensesPipeline,
  buildVehicleFuelRecordStatsPipeline,
} from "@/app/lib/db/agregations/vehiclePipelines";
import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { ServiceRecord } from "@/app/lib/db/models/ServiceRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { Vehicle as VehicleType } from "@/app/lib/types/vehicle";
import { calculateFuelHistory, FuelHistoryRecord } from "@/app/lib/vehicle/fuelHistory";

import dbConnect from "../mongodb";

import { getGroupById } from "./groupController";

export async function getVehicles(currentUser: UserType) {
  const userId = currentUser._id;
  const groupIds = currentUser.groups.map((g) => g._id);

  return Vehicle.find({
    $or: [{ createdBy: userId }, { group: { $in: groupIds } }],
  });
}

export async function getVehicleById(
  currentUser: UserType,
  vehicleId: string,
  includeStats?: boolean
) {
  const vehicle = await withAccessCheck(
    () => Vehicle.findById(vehicleId).lean(),
    currentUser,
    {
      getGroupId: (s) => s.group,
    }
  );

  if (!vehicle) {
    return null;
  }

  if (includeStats) {
    const [[fuelStats], [expenseStats], fuelRecords] = await Promise.all([
      FuelRecord.aggregate(buildVehicleFuelRecordStatsPipeline(vehicleId)),
      ServiceRecord.aggregate(buildVehicleExpensesPipeline(vehicleId)),
      FuelRecord.find({ vehicle: vehicleId })
        .select("odometer liters amount currency fullTank createdAt")
        .sort({ odometer: 1, createdAt: 1, _id: 1 })
        .lean<FuelHistoryRecord[]>(),
    ]);
    const fuelHistory = calculateFuelHistory(fuelRecords);
    return {
      ...vehicle,
      stats: { fuel: fuelStats, expenses: expenseStats, fuelHistory },
    };
  }

  return vehicle;
}

export async function createVehicle(
  currentUser: UserType,
  payload: Partial<VehicleType>
) {
  await dbConnect();

  if (typeof payload.group === "string") {
    await getGroupById(payload.group, currentUser);
  }

  return await Vehicle.create({
    ...payload,
    createdBy: currentUser._id,
  });
}

export async function updateVehicle(
  currentUser: UserType,
  vehicleId: string,
  payload: Partial<VehicleType>
) {
  await dbConnect();

  await withAccessCheck(() => Vehicle.findById(vehicleId), currentUser, {
    getGroupId: (s) => s.group,
  });

  return Vehicle.findByIdAndUpdate(vehicleId, payload, {
    new: true,
  });
}
