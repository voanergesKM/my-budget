import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler";

import { extractPublicId } from "@/app/lib/api/deleteUploadedImage";

import {
  createGroup,
  deleteGroup,
  getGroupById,
  updateGroup,
} from "@/app/lib/db/controllers/groupController";
import { getUser } from "@/app/lib/db/controllers/userController";

export const GET = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const currentUser = await getUser(token);

  if (id) {
    const group = await getGroupById(id, currentUser);

    return NextResponse.json({ success: true, data: group }, { status: 200 });
  }

  return NextResponse.json({ success: false, data: null }, { status: 400 });
});

export const POST = wrapPrivateHandler(async (req: NextRequest, token) => {
  const payload = await req.json();

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const item = await createGroup(token.id, payload);

  return NextResponse.json(
    {
      success: true,
      data: item,
      message: t("created", {
        entity: te("group.accusative"),
        name: item.name,
      }),
    },
    { status: 200 }
  );
});

export const PATCH = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, data: null }, { status: 400 });
  }

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const payload = await req.json();

  const currentUser = await getUser(token);

  const item = await updateGroup(id, payload, currentUser);
  console.log("🚀 ~ item:", item);

  return NextResponse.json(
    {
      success: true,
      data: item,
      message: t("updated", {
        entity: te("group.accusative"),
        name: item.name,
      }),
    },
    { status: 200 }
  );
});

export const DELETE = wrapPrivateHandler(async (req: NextRequest, token) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, data: null }, { status: 400 });
  }

  const t = await withServerTranslations("Notifications");
  const te = await withServerTranslations("Entities");

  const currentUser = await getUser(token);

  const data = await deleteGroup(id, currentUser);

  if (data.image) {
    try {
      await cloudinary.uploader.destroy(extractPublicId(data.image));
    } catch (error) {
      console.error("Error deleting image from Cloudinary", error);
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: null,
      message: t("deleted", { entity: te("group.accusative"), name: "" }),
    },
    { status: 200 }
  );
});
