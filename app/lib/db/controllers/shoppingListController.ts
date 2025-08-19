import {
  Shopping as ShoppingType,
  User as UserType,
} from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { Group, Shopping, User } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";
import { NotFoundError } from "@/app/lib/errors/customErrors";

export async function getShoppingsList({
  groupId,
  currentUser,
  page,
  pageSize,
}: {
  groupId: string | null;
  currentUser: UserType;
  page: number;
  pageSize: number;
}) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query = groupId ? { groupId } : { createdBy: currentUser._id };

  const [list, totalCount] = await Promise.all([
    // withAccessCheck(
    //   () =>
    //     Shopping.find(query)
    //       .sort({ createdAt: -1 })
    //       .skip(skip)
    //       .limit(pageSize)
    //       .populate(["createdBy", "groupId"]),
    //   currentUser,
    //   {
    //     getCreatedBy: (s) => s.createdBy?._id.toString(),
    //     getGroupId: (s) => s.groupId?._id.toString(),
    //   }
    // ),

    Shopping.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate(["createdBy", "groupId"]),

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

export async function getShoppingById(id: string, currentUser: UserType) {
  await dbConnect();

  return await withAccessCheck(
    () => Shopping.findById(id).populate(["createdBy", "groupId"]),
    currentUser,
    {
      getCreatedBy: (s) => s.createdBy?._id.toString(),
      getGroupId: (s) => s.groupId?._id.toString(),
    }
  );
}

export async function createShopping(
  currentUser: UserType,
  groupId: string,
  payload: ShoppingType
): Promise<ShoppingType> {
  await dbConnect();

  const { title, items } = payload;

  if (!!groupId) {
    return await withAccessCheck(
      () =>
        Shopping.create({
          title,
          createdBy: currentUser._id,
          groupId,
          items,
        }),
      currentUser,
      {
        getCreatedBy: (s) => s.createdBy._id.toString(),
        getGroupId: (s) => s.groupId._id.toString(),
      }
    );
  } else {
    return await Shopping.create({
      title,
      createdBy: currentUser._id,
      groupId,
      items,
    });
  }
}

export async function updateShopping(
  payload: ShoppingType,
  currentUser: UserType
): Promise<ShoppingType> {
  await dbConnect();

  const { _id, title, items, completed } = payload;

  const result = await withAccessCheck(
    () =>
      Shopping.findByIdAndUpdate(
        _id,
        { title, items, completed },
        { new: true }
      ),
    currentUser
  );

  return result;
}

export async function deleteShoppings(ids: string[], currentUser: UserType) {
  await dbConnect();

  await withAccessCheck(
    () => Shopping.find({ _id: { $in: ids } }),
    currentUser
  );

  return await Shopping.deleteMany({ _id: { $in: ids } });
}

export async function toggleShoppingStatus(
  payload: {
    shoppingId: string;
    status: boolean;
    itemId?: string | null;
  },
  currentUser: UserType
) {
  await dbConnect();

  const { shoppingId, status, itemId } = payload;

  await withAccessCheck(
    () => Shopping.findById(shoppingId).populate(["createdBy", "groupId"]),
    currentUser,
    {
      getCreatedBy: (s) => s.createdBy?._id.toString(),
      getGroupId: (s) => s.groupId?._id.toString(),
    }
  );

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
