import { NextRequest } from "next/server";
import mongoose from "mongoose";

import { Group as GroupType, UserSession } from "@/app/lib/definitions";
import { getValidToken } from "@/app/lib/utils/getValidToken";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { Group, PendingInvitation, User } from "@/app/lib/db/models";
import { NotAuthorizedError } from "@/app/lib/errors/customErrors";

import dbConnect from "../mongodb";

import { addPendingInvitation } from "./pendingInvitationController";

const populateGroupMembers = [
  { path: "members", select: "firstName lastName email avatarURL role" },
  { path: "createdBy", select: "firstName lastName email avatarURL role" },
];

export async function getGroupById(
  id: string,
  currentUser: UserSession["user"]
) {
  await dbConnect();

  const [group, pendingMembers] = await Promise.all([
    withAccessCheck(
      () => Group.findById(id).populate(populateGroupMembers),
      currentUser
    ),
    PendingInvitation.find({ groupId: id }),
  ]);

  const groupData = group?.toObject({ virtuals: true });

  return { ...groupData, pendingMembers };
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

export async function createGroup(createdBy: string, data: GroupType) {
  await dbConnect();

  const { pendingMembers = [], ...rest } = data;

  const normalizedEmails = Array.from(
    new Set(pendingMembers.map((m) => m.email.toLowerCase()))
  );

  const existingUsers = await User.find({
    email: { $in: normalizedEmails },
  }).select("_id email");

  const existingEmails = existingUsers.map((u) => u.email.toLowerCase());
  const existingUserIds = existingUsers.map((u) => u._id.toString());

  const pendingEmails = normalizedEmails.filter(
    (email) => !existingEmails.includes(email)
  );

  const memberIds = Array.from(new Set([createdBy, ...existingUserIds]));

  const group = await Group.create({
    ...rest,
    createdBy,
    members: memberIds,
  });

  await User.updateMany(
    { _id: { $in: memberIds } },
    { $addToSet: { groups: group._id } }
  );

  if (pendingEmails.length > 0) {
    await addPendingInvitation({
      emails: pendingEmails,
      groupId: group._id,
      invitedBy: createdBy,
    });
  }

  return group;
}

export async function updateGroup(
  id: string,
  data: GroupType,
  currentUser: UserSession["user"]
) {
  await dbConnect();

  const { pendingMembers = [], ...groupData } = data;

  const normalizedEmails = Array.from(
    new Set(pendingMembers.map((m) => m.email.toLowerCase()))
  );

  const existingUsers = await User.find({
    email: { $in: normalizedEmails },
  }).select("_id email");

  const existingEmails = existingUsers.map((u) => u.email.toLowerCase());
  const existingUserIds = existingUsers.map((u) => u._id.toString());

  const pendingEmails = normalizedEmails.filter(
    (email) => !existingEmails.includes(email)
  );

  const updatedGroup = await withAccessCheck(async () => {
    const group = await Group.findById(id);

    if (!group) throw new Error("Group not found");

    const updatedMembers = new Set([
      ...group.members.map((id: mongoose.Types.ObjectId) => id.toString()),
      ...existingUserIds,
    ]);

    group.set({ ...groupData, members: Array.from(updatedMembers) });

    return group.save();
  }, currentUser);

  if (existingUserIds.length > 0) {
    await User.updateMany(
      { _id: { $in: existingUserIds } },
      { $addToSet: { groups: id } }
    );
  }

  if (pendingEmails.length > 0) {
    await addPendingInvitation({
      emails: pendingEmails,
      groupId: id,
      invitedBy: currentUser.id,
    });
  }

  return updatedGroup;
}

export async function deleteGroup(
  id: string,
  currentUser: UserSession["user"]
) {
  await dbConnect();

  const group: GroupType | null = await withAccessCheck(
    () => Group.findById(id),
    currentUser
  );

  if (group) {
    await Promise.all([
      await User.updateMany(
        { groups: { $in: id } },
        { $pull: { groups: group._id } }
      ),

      await PendingInvitation.deleteMany({ groupId: id }),
    ]);
  }

  return await Group.findByIdAndDelete(id);
}

export async function deleteGroupMember(
  groupId: string,
  memberId: string,
  currentUser: UserSession["user"]
) {
  await dbConnect();

  return await withAccessCheck(
    () => Group.findByIdAndUpdate(groupId, { $pull: { members: memberId } }),
    currentUser
  );
}
