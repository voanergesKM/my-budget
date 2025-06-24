import { NextRequest } from "next/server";
import { Group } from "@/app/lib/db/models";
import { getValidToken } from "@/app/lib/utils/getValidToken";
import dbConnect from "../mongodb";
import { NotAuthorizedError } from "../../errors/customErrors";

const populateGroupMembers = [
  { path: "members", select: "name email avatarURL" },
  { path: "createdBy", select: "name email avatarURL" },
];

export async function getGroupById(id: string) {
  await dbConnect();

  return await Group.findById(id);
}

export async function getGroupByName(name: string) {
  await dbConnect();

  return await Group.findOne({ name });
}

export async function getAllGroups(req: NextRequest) {
  await dbConnect();

  const token = await getValidToken(req);

  if (!token) {
    throw new NotAuthorizedError("Unauthorized user");
  }

  const { role, id } = token as any;

  if (role === "admin") {
    return await Group.find({}).populate(populateGroupMembers);
  } else {
    const groups = await Group.find({ members: id }).populate(
      populateGroupMembers
    );

    return groups;
  }
}

export async function createGroup(data: any) {
  await dbConnect();

  return await Group.create(data);
}
