import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Group from "../models/Group";

const secret = process.env.AUTH_SECRET;

export async function getGroupById(id: string) {
  return await Group.findById(id);
}

export async function getGroupByName(name: string) {
  return await Group.findOne({ name });
}

export async function getAllGroups(req: NextRequest) {
  const token = await getToken({ req, secret });
  console.log(token);

  // @ts-ignore
  const { role, id } = token;

  if (role === "admin") {
    return await Group.find({});
  }
  return await Group.find({ members: id });
}

export async function createGroup(data: any) {
  return await Group.create(data);
}
