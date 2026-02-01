import { NextRequest, NextResponse } from "next/server";

import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getUser } from "@/app/lib/db/controllers/userController";
import {
  createVehicle,
  getVehicleById,
  getVehicles,
  updateVehicle,
} from "@/app/lib/db/controllers/vehiclesController";
import { Vehicle } from "@/app/lib/db/models/Vehicle";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get("vehicleId");

  if (vehicleId) {
    const data = await getVehicleById(currentUser, vehicleId);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } else {
    const list = await getVehicles(currentUser);

    return NextResponse.json({ success: true, data: list }, { status: 200 });
  }
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const payload = await req.json();

  const vehicle = await createVehicle(currentUser, payload);

  return NextResponse.json({ success: true, data: vehicle }, { status: 200 });
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const payload = await req.json();

  const { _id, ...requestObj } = payload;

  const vehicle = await updateVehicle(currentUser, _id, requestObj);

  return NextResponse.json({ success: true, data: vehicle }, { status: 200 });
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const currentUser = await getUser(token);

  const { vehicleId } = await req.json();

  await withAccessCheck(() => Vehicle.findById(vehicleId), currentUser, {
    getGroupId: (s) => s.group,
  });

  const record = await Vehicle.deleteOne({ _id: vehicleId });

  return NextResponse.json(
    { success: true, data: { record } },
    { status: 200 }
  );
});
