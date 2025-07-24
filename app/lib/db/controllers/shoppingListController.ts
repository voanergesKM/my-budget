import { Types } from "mongoose";

import { Shopping as ShoppingType, UserSession } from "@/app/lib/definitions";
import hasUserOrGroupAccess from "@/app/lib/utils/hasUserOrGroupAccess";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import Shopping from "@/app/lib/db/models/Shopping";
import dbConnect from "@/app/lib/db/mongodb";
import { ForbiddenError, NotFoundError } from "@/app/lib/errors/customErrors";

export async function getShoppingsList({
  groupId,
  userId,
  page,
  pageSize,
}: {
  groupId: string | null;
  userId: string;
  page: number;
  pageSize: number;
}) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query = groupId ? { groupId } : { createdBy: userId };

  const [list, totalCount] = await Promise.all([
    Shopping.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate("createdBy"),
    Shopping.countDocuments(query),
  ]);

  return {
    list,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasMore: page < Math.ceil(totalCount / pageSize),
  };
}

export async function getShoppingById(
  id: string,
  currentUser: UserSession["user"]
) {
  await dbConnect();

  return await withAccessCheck(
    () => Shopping.findById(id).populate(["createdBy", "groupId"]),
    currentUser,
    {
      getCreatedBy: (s) => s.createdBy?._id?.toString(),
      getGroupId: (s) => s.group?._id?.toString(),
    }
  );
}

export async function createShopping(
  createdBy: string,
  groupId: string,
  payload: ShoppingType
) {
  await dbConnect();

  const { title, items } = payload;

  const shoppingItem = await Shopping.create({
    title,
    createdBy,
    groupId,
    items,
  });

  return shoppingItem;
}

export async function updateShopping(
  payload: ShoppingType,
  userId: string,
  userGroupIds: string[]
) {
  await dbConnect();

  const { _id, title, items, completed } = payload;

  const shoppingItem = await Shopping.findById(_id);

  const canGetData = hasUserOrGroupAccess(shoppingItem, {
    userId,
    userGroupIds,
  });

  if (!canGetData) {
    throw new ForbiddenError();
  }

  const result = await Shopping.findByIdAndUpdate(
    _id,
    { title, items, completed },
    { new: true }
  );

  return result;
}

export async function deleteShoppings(
  ids: string[],
  userId: string,
  userGroupIds: string[]
) {
  await dbConnect();

  const objectIds = ids.map((id) => new Types.ObjectId(id));

  const shoppings = await Shopping.find({ _id: { $in: objectIds } });

  const allowedIds = shoppings
    .filter(
      (s) =>
        s.createdBy?.toString() === userId ||
        (s.groupId && userGroupIds.includes(s.groupId.toString()))
    )
    .map((s) => s._id);

  if (allowedIds.length === 0) {
    throw new ForbiddenError();
  }

  const result = await Shopping.deleteMany({ _id: { $in: allowedIds } });

  return result;
}

export async function toggleShoppingStatus(
  payload: {
    shoppingId: string;
    status: boolean;
    itemId?: string | null;
  },
  userId: string,
  userGroupIds: string[]
) {
  await dbConnect();

  const { shoppingId, status, itemId } = payload;

  const targetShopping = await Shopping.findById(shoppingId);
  if (!targetShopping) throw new NotFoundError("Shopping not found");

  const canGetData = hasUserOrGroupAccess(targetShopping, {
    userId,
    userGroupIds,
  });

  if (!canGetData) {
    throw new ForbiddenError();
  }

  if (itemId) {
    const updated = await Shopping.findOneAndUpdate(
      {
        _id: shoppingId,
        "items.id": itemId,
      },
      {
        $set: { "items.$.completed": !status },
      },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundError("Item not found or update failed");
    }

    return updated;
  }

  const result = await Shopping.findByIdAndUpdate(
    shoppingId,
    { completed: !status },
    { new: true }
  );

  return result;
}
