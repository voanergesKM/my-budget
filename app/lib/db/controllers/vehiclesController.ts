import { User as UserType } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { Vehicle as VehicleType } from "@/app/lib/types/vehicle";

import dbConnect from "../mongodb";

import { getGroupById } from "./groupController";

export async function getVehicles(currentUser: UserType) {
  const userId = currentUser._id;
  const groupIds = currentUser.groups.map((g) => g._id);

  return Vehicle.find({
    $or: [{ createdBy: userId }, { group: { $in: groupIds } }],
  });
}

export async function getVehicleById(currentUser: UserType, vehicleId: string) {
  return await withAccessCheck(() => Vehicle.findById(vehicleId), currentUser, {
    getGroupId: (s) => s.group,
  });
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
