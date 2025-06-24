import { NextRequest } from "next/server";
import { User, Group } from "@/app/lib/db/models";
import { getValidToken } from "../../utils/getValidToken";
import dbConnect from "../mongodb";

export async function getGroupById(id: string) {
  await dbConnect();

  return await Group.findById(id);
}

export async function getGroupByName(name: string) {
  return await Group.findOne({ name });
}

export async function getAllGroups(req: NextRequest) {
  const token = await getValidToken(req);
  await dbConnect();

  console.log("getAllGroups => token", token);

  // @ts-ignore
  const { role, id } = token;

  if (role === "admin") {
    return await Group.find({});
  } else {
    const groups = await Group.find({ members: id }).populate([
      { path: "members", select: "name email avatarURL" },
      { path: "createdBy", select: "name email avatarURL" },
    ]);

    console.log("getAllGroups => groups", groups);

    return groups;
  }
}

export async function createGroup(data: any) {
  await dbConnect();

  return await Group.create(data);
}
