import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { User, Group } from "@/app/lib/db/models";

const secret = process.env.AUTH_SECRET;

export async function getGroupById(id: string) {
  return await Group.findById(id);
}

export async function getGroupByName(name: string) {
  return await Group.findOne({ name });
}

export async function getAllGroups(req: NextRequest) {
  const token = await getToken({ req, secret });

  // @ts-ignore
  const { role, id } = token;

  if (role === "admin") {
    return await Group.find({});
  } else {
    return await Group.find({ members: id }).populate([
      { path: "members", select: "name email avatarURL" },
      { path: "createdBy", select: "name email avatarURL" },
    ]);
  }
}

export async function createGroup(data: any) {
  return await Group.create(data);
}
