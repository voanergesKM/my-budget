import { NextRequest, NextResponse } from "next/server";
import {
  getGroupById,
  getGroupByName,
  getAllGroups,
  createGroup,
} from "@/app/lib/db/controllers/groupController";
import { wrapHandler } from "@/app/lib/utils/wrapHandler";
import { wrapPrivateHandler } from "@/app/lib/utils/wrapPrivateHandler ";
import { updateUser } from "@/app/lib/db/controllers/userController";
import User from "@/app/lib/db/models/User";
import mongoose from "mongoose";

export const GET = wrapPrivateHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const userId = searchParams.get("userId");
  const isAdminParam = searchParams.get("isAdmin");
  const isAdmin = isAdminParam === "true";

  if (id) {
    const group = await getGroupById(id);
    return NextResponse.json({ success: true, data: group }, { status: 200 });
  }

  if (name) {
    const group = await getGroupByName(name);
    return NextResponse.json({ success: true, data: group }, { status: 200 });
  }

  const groups = await getAllGroups(req);
  return NextResponse.json({ success: true, data: groups }, { status: 200 });
});

export const POST = wrapHandler(async (req: NextRequest) => {
  const body = await req.json();

  const { userId, name } = body;


  const groupData = {
    name,
    members: [userId],
    createdBy: userId,
  };

  const group = await createGroup(groupData);

  
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $addToSet: { groupIds: group._id },
  }, {new: true});

  console.log("Updated user groupIds:", updatedUser?.groupIds);

  return NextResponse.json(
    { success: true, data: { group, updatedUser } },
    { status: 201 }
  );
});
