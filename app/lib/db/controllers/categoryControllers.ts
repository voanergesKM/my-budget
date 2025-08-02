import mongoose from "mongoose";

import {
  Category as CategoryType,
  User as UserType,
} from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { Category } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";

import { getGroupById } from "./groupController";

export async function getAllCategories(
  currentUser: UserType,
  origin: string | null,
  groupId: string | null
) {
  await dbConnect();

  if (!!groupId) {
    return await withAccessCheck(
      () =>
        Category.find({
          group: groupId,
          type: origin,
        }),
      currentUser,
      {
        getGroupId: (c) => c.group._id.toString(),
        getCreatedBy: (c) => c.createdBy._id.toString(),
      }
    );
  } else {
    return await Category.find({
      createdBy: new mongoose.Types.ObjectId(currentUser._id),
      type: origin,
    });
  }
}

export async function createCategory(
  currentUser: UserType,
  groupId: string,
  payload: CategoryType
) {
  await dbConnect();

  const { _id, ...rest } = payload;

  if (!!groupId) {
    await getGroupById(groupId, currentUser);
  }

  return await Category.create({
    ...rest,
    createdBy: currentUser._id,
    group: groupId,
  });
}

export async function updateCategory(
  currentUser: UserType,
  groupId: string,
  payload: CategoryType
) {
  await dbConnect();

  const { _id, ...rest } = payload;

  if (!!groupId) {
    await getGroupById(groupId, currentUser);
  }

  return await Category.findByIdAndUpdate(_id, rest, { new: true });
}
