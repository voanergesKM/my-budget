import {
  PublicUser,
  User as UserType,
  UserSession,
} from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { Group, PendingInvitation, User } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";
import {
  NotAuthorizedError,
  NotFoundError,
} from "@/app/lib/errors/customErrors";

export async function getAllUsers() {
  await dbConnect();

  return await User.find({});
  //   .populate({
  //   path: "groups",
  //   populate: [
  //     {
  //       path: "members",
  //       select: "name email avatarURL",
  //     },
  //     {
  //       path: "createdBy",
  //       select: "name email avatarURL",
  //     },
  //   ],
  // });
}

export async function getUser(
  currentUser: UserSession["user"],
  id?: string
): Promise<UserType> {
  await dbConnect();

  if (!!id && id !== currentUser.id && currentUser.role !== "admin") {
    throw new NotAuthorizedError();
  }

  const user = await User.findById(currentUser.id).populate({
    path: "groups",
    populate: [
      { path: "members", select: "name email avatarURL" },
      { path: "createdBy", select: "name email avatarURL" },
    ],
  });

  if (!user) throw new NotFoundError("User not found");

  return user;
}

export async function findOrCreateUser(payload: Partial<PublicUser>) {
  await dbConnect();

  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await User.create(payload);

  return newUser;
}

export async function getUserByEmail(email: string) {
  await dbConnect();

  const user = await User.findOne({ email }).populate({
    path: "groups",
    populate: [
      { path: "members", select: "name email avatarURL" },
      { path: "createdBy", select: "name email avatarURL" },
    ],
  });

  if (!user) throw new NotFoundError("User not found");

  return user;
}

export async function createUser(payload: any) {
  await dbConnect();

  const email = payload.email.toLowerCase();

  const pendingInvites = await PendingInvitation.find({ email });

  const groupIds = pendingInvites.map((invite) => invite.groupId);

  const user = await User.create({
    ...payload,
    groups: groupIds,
  });

  if (groupIds.length > 0) {
    await Group.updateMany(
      { _id: { $in: groupIds } },
      { $addToSet: { members: user._id } }
    );

    await PendingInvitation.deleteMany({ email });
  }

  return user;
}

export async function updateUser(id: string, payload: {}) {
  await dbConnect();

  const user = await User.findByIdAndUpdate(id, payload, { new: true });

  return user;
}

export async function deleteUserFeromGroup(
  groupId: string,
  userId: string,
  currentUser: UserType
) {
  await dbConnect();

  return await withAccessCheck(
    () => User.findByIdAndUpdate(userId, { $pull: { groups: groupId } }),
    currentUser
  );
}
