import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import {
  createScheduleRecord,
  deleteScheduleRecords,
  getScheduleRecords,
  updateScheduleRecord,
} from "@/app/lib/db/controllers/scheduleRecordsController";
import { getUser } from "@/app/lib/db/controllers/userController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get("vehicleId");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  if (vehicleId) {
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

    const list = await getScheduleRecords(
      currentUser,
      vehicleId,
      page ? +page : 1,
      pageSize ? +pageSize : 10
    );

    return NextResponse.json({ success: true, data: list }, { status: 200 });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { deletedRecords, vehicleId } = await req.json();

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

  const recordIds = deletedRecords.map((r: { recordId: string }) => r.recordId);
  const deleted = await deleteScheduleRecords(recordIds);

  return NextResponse.json({ success: true, data: deleted }, { status: 200 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { record, vehicleId } = await req.json();

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

  const reminder = await createScheduleRecord(currentUser, {
    ...record,
    vehicle: vehicleId,
  });

  return NextResponse.json(
    {
      data: reminder,
      success: true,
    },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { record, vehicleId } = await req.json();

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

  const updated = await updateScheduleRecord(record._id, record);

  if (record.status === "completed" && record.repeat) {
    const nextTriggerDate =
      record.month && record.month > 0
        ? new Date(
            new Date().setMonth(new Date().getMonth() + record.month)
          ).toISOString()
        : undefined;

    const nextTriggerOdometer =
      record.nextOdometer && record.nextOdometer > 0
        ? record.nextOdometer
        : undefined;

    if (nextTriggerDate || nextTriggerOdometer) {
      await createScheduleRecord(currentUser, {
        vehicle: vehicleId,
        title: record.title,
        category: record.category,
        triggerDate: nextTriggerDate || null,
        triggerOdometer: nextTriggerOdometer || null,
        status: "scheduled",
      });
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: updated,
    },
    { status: 200 }
  );
});
