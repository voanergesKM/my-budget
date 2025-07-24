import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { extractPublicId } from "@/app/lib/api/deleteUploadedImage";

import {
  createGroup,
  deleteGroup,
  getGroupById,
  updateGroup,
} from "@/app/lib/db/controllers/groupController";

export const GET = wrapPrivateHandler(async (req: NextRequest, currentUser) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const group = await getGroupById(id, currentUser);

    return NextResponse.json({ success: true, data: group }, { status: 200 });
  }

  return NextResponse.json({ success: false, data: null }, { status: 400 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const item = await createGroup(token.id, payload);

  return NextResponse.json(
    { success: true, data: item, message: "Group created successfully" },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, data: null }, { status: 400 });
  }

  const payload = await req.json();

  const item = await updateGroup(id, payload, token);

  return NextResponse.json(
    { success: true, data: item, message: "Group updated successfully" },
    { status: 200 }
  );
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, data: null }, { status: 400 });
  }

  const data = await deleteGroup(id, token);

  if (data.image) {
    try {
      await cloudinary.uploader.destroy(extractPublicId(data.image));
    } catch (error) {
      console.error("Error deleting image from Cloudinary", error);
    }
  }

  return NextResponse.json(
    { success: true, data: null, message: "Group deleted successfully" },
    { status: 200 }
  );
});
