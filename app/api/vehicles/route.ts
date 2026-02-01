import { NextRequest, NextResponse } from "next/server";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { getUser } from "@/app/lib/db/controllers/userController";
import {
  createVehicle,
  getVehicleById,
  getVehicles,
  updateVehicle,
} from "@/app/lib/db/controllers/vehiclesController";

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
