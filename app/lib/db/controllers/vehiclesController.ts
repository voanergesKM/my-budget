import { User as UserType } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import {
  buildVehicleExpensesPipeline,
  buildVehicleFuelRecordStatsPipeline,
} from "@/app/lib/db/agregations/vehiclePipelines";
import { FuelRecord } from "@/app/lib/db/models/FuelRecord";
import { ServiceRecord } from "@/app/lib/db/models/ServiceRecord";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { VehicleReminder } from "@/app/lib/db/models/VehicleReminder";
import { ConflictError, ValidationError } from "@/app/lib/errors/customErrors";
import { Vehicle as VehicleType } from "@/app/lib/types/vehicle";
import {
  calculateFuelHistory,
  FuelHistoryRecord,
} from "@/app/lib/vehicle/fuelHistory";
import {
  convertDistance,
  DistanceUnit,
  FuelUnit,
} from "@/app/lib/vehicle/units";

import dbConnect from "../mongodb";

import { getGroupById } from "./groupController";

type UnitPayload = Partial<VehicleType> & {
  distanceUnit?: DistanceUnit;
  fuelUnit?: FuelUnit;
};

function validateUnits(payload: UnitPayload) {
  if (
    Object.keys(payload).some((key) => key.startsWith("$") || key.includes("."))
  )
    throw new ValidationError("Invalid vehicle update");
  if (
    payload.distanceUnit !== undefined &&
    !["km", "mi"].includes(payload.distanceUnit)
  )
    throw new ValidationError("Invalid distance unit");
  if (
    payload.fuelUnit !== undefined &&
    !["l", "us_gal"].includes(payload.fuelUnit)
  )
    throw new ValidationError("Invalid fuel unit");
}

async function vehicleHasHistory(vehicleId: string): Promise<boolean> {
  const [fuel, service, schedule] = await Promise.all([
    FuelRecord.exists({ vehicle: vehicleId }),
    ServiceRecord.exists({ vehicle: vehicleId }),
    VehicleReminder.exists({ vehicle: vehicleId }),
  ]);
  return Boolean(fuel || service || schedule);
}

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
  const vehicle = (await withAccessCheck(
    () => Vehicle.findById(vehicleId).lean<VehicleType>(),
    currentUser,
    {
      getGroupId: (s) => s.group,
    }
  )) as VehicleType;

  if (!vehicle) {
    return null;
  }

  const normalizedVehicle = {
    ...vehicle,
    distanceUnit: vehicle.distanceUnit ?? "km",
    fuelUnit: vehicle.fuelUnit ?? "l",
    hasHistory: await vehicleHasHistory(vehicleId),
  };

  if (includeStats) {
    const [[fuelStats], [expenseStats], fuelRecords] = await Promise.all([
      FuelRecord.aggregate(buildVehicleFuelRecordStatsPipeline(vehicleId)),
      ServiceRecord.aggregate(buildVehicleExpensesPipeline(vehicleId)),
      FuelRecord.find({ vehicle: vehicleId })
        .select("odometer liters amount currency fullTank createdAt")
        .sort({ odometer: 1, createdAt: 1, _id: 1 })
        .lean<FuelHistoryRecord[]>(),
    ]);
    const fuelHistory = calculateFuelHistory(fuelRecords, {
      distance: normalizedVehicle.distanceUnit,
      fuel: normalizedVehicle.fuelUnit,
    });
    return {
      ...normalizedVehicle,
      stats: { fuel: fuelStats, expenses: expenseStats, fuelHistory },
    };
  }

  return normalizedVehicle;
}

export async function createVehicle(
  currentUser: UserType,
  payload: UnitPayload
) {
  await dbConnect();
  validateUnits(payload);

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
  payload: UnitPayload
) {
  await dbConnect();
  validateUnits(payload);

  const vehicle = await withAccessCheck(
    () => Vehicle.findById(vehicleId),
    currentUser,
    {
      getGroupId: (s) => s.group,
    }
  );

  // Vehicle details forms can be stale. Odometers are managed by records and
  // must not be overwritten by fields copied from the form's initial data.
  delete payload.odometer;
  delete payload.currentOdometer;

  const previousDistanceUnit: DistanceUnit = vehicle.distanceUnit ?? "km";
  const previousFuelUnit: FuelUnit = vehicle.fuelUnit ?? "l";
  const distanceChanged =
    payload.distanceUnit !== undefined &&
    payload.distanceUnit !== previousDistanceUnit;
  const fuelChanged =
    payload.fuelUnit !== undefined && payload.fuelUnit !== previousFuelUnit;
  if (
    (distanceChanged || fuelChanged) &&
    (await vehicleHasHistory(vehicleId))
  ) {
    throw new ConflictError(
      "Units cannot be changed after vehicle records have been added"
    );
  }
  if (distanceChanged) {
    // The client sends settings, not replacement odometer values, on edit.
    if (typeof vehicle.odometer === "number")
      payload.odometer = convertDistance(
        vehicle.odometer,
        previousDistanceUnit,
        payload.distanceUnit!
      );
    if (typeof vehicle.currentOdometer === "number")
      payload.currentOdometer = convertDistance(
        vehicle.currentOdometer,
        previousDistanceUnit,
        payload.distanceUnit!
      );
  }

  return Vehicle.findByIdAndUpdate(vehicleId, payload, {
    new: true,
    runValidators: true,
  });
}
