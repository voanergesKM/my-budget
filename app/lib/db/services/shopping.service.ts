import {
  Shopping as ShoppingType,
  User as UserType,
} from "@/app/lib/definitions";
import { buildQuery } from "@/app/lib/utils/buildQuery";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { buildTransactionAccessFilter } from "@/app/lib/db/access";
import { Shopping } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";
import { shoppingRepository } from "@/app/lib/db/repositories";
import { NotFoundError } from "@/app/lib/errors/customErrors";

type Query = Record<string, any>;

export const shoppingService = {
  async getAll(currentUser: UserType, groupId: string | null, query: Query) {
    await dbConnect();

    const { paginationParams, mongoQuery } = buildQuery(
      query,
      currentUser,
      groupId
    );

    const { group: requestGroupId, ...rest } = mongoQuery;

    const skip = (paginationParams.page - 1) * paginationParams.pageSize;

    const [list, totalCount] = await Promise.all([
      shoppingRepository.findPaginated(
        { ...rest, ...(requestGroupId && { groupId: requestGroupId }) },
        skip,
        paginationParams.pageSize,
        ["createdBy", "groupId"]
      ),
      shoppingRepository.count({
        ...rest,
        ...(requestGroupId && { groupId: requestGroupId }),
      }),
    ]);

    return {
      list,
      totalCount,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
      currentPage: paginationParams.page,
      hasMore:
        paginationParams.page <
        Math.ceil(totalCount / paginationParams.pageSize),
    };
  },

  async getOne(shoppingId: string, currentUser: UserType) {
    await dbConnect();

    return withAccessCheck(
      () => shoppingRepository.findById(shoppingId),
      currentUser,
      {
        getGroupId: (c) => c.groupId?._id.toString(),
      }
    );
  },

  async create(currentUser: UserType, shopping: Partial<ShoppingType>) {
    await dbConnect();

    const payload = {
      ...shopping,
      createdBy: currentUser._id,
    };

    return shoppingRepository.create(payload);
  },

  async updateOne(currentUser: UserType, payload: ShoppingType) {
    await dbConnect();

    const { _id: shoppingId, title, items, completed } = payload;

    await withAccessCheck(
      () => shoppingRepository.findById(shoppingId),
      currentUser,
      {
        getGroupId: (c) => c.groupId?._id.toString(),
        getCreatedBy: (c) => c.createdBy?._id.toString(),
      }
    );

    return shoppingRepository.updateOne(shoppingId, {
      title,
      items,
      completed,
    });
  },

  async updateStatus(currentUser: UserType, payload: any) {
    await dbConnect();

    const { shoppingId, status, itemId } = payload;

    await withAccessCheck(
      () => shoppingRepository.findById(shoppingId),
      currentUser,
      {
        getGroupId: (c) => c.groupId?._id.toString(),
        getCreatedBy: (c) => c.createdBy?._id.toString(),
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

    return shoppingRepository.updateOne(shoppingId, {
      completed: !status,
    });
  },

  async deleteMany(currentUser: UserType, ids: string[]) {
    await dbConnect();

    const filter = buildTransactionAccessFilter(currentUser, {
      _id: { $in: ids },
    });

    const result = await shoppingRepository.deleteMany(filter);

    return result.deletedCount;
  },
};
