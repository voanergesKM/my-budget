import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { refreshVehicleReminders } from "@/app/lib/db/controllers/scheduleRecordsController";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { VehicleReminder } from "@/app/lib/db/models/VehicleReminder";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";

export const GET = wrapPrivateHandler(
  async (req: NextRequest, token, context) => {
    const currentUser = await getUser(token);

    const { vehicleId } = await context.params;

    const vehicle = await withAccessCheck(
      () => Vehicle.findById(vehicleId),
      currentUser,
      {
        getGroupId: (s) => s.group,
      }
    );

    if (!vehicle) {
      throw new NotAuthorizedError();
    }

    await refreshVehicleReminders(vehicleId, vehicle.currentOdometer);

    const reminders = await VehicleReminder.find({
      vehicle: vehicleId,
      status: { $in: ["due", "overdue"] },
    });

    return NextResponse.json(
      { success: true, data: reminders },
      { status: 200 }
    );
  }
);
