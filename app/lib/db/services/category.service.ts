import {
  Category as CategoryType,
  User as UserType,
} from "@/app/lib/definitions";
import { buildQuery } from "@/app/lib/utils/buildQuery";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { buildTransactionAccessFilter } from "@/app/lib/db/access";
import dbConnect from "@/app/lib/db/mongodb";
import { categoryRepository } from "@/app/lib/db/repositories";
import { ForbiddenError } from "@/app/lib/errors/customErrors";

type Query = Record<string, any>;

export const categoryService = {
  async getAll(currentUser: UserType, groupId: string | null, query: Query) {
    await dbConnect();

    const { mongoQuery } = buildQuery(query, currentUser, groupId);

    return categoryRepository.find(mongoQuery);
  },

  async getOne(paymentId: string) {
    await dbConnect();

    return categoryRepository.findById(paymentId);
  },

  async create(
    currentUser: UserType,
    groupId: string,
    category: Partial<CategoryType>
  ) {
    await dbConnect();

    const payload = {
      ...category,
      createdBy: currentUser._id,
      group: groupId,
    };

    return categoryRepository.create(payload);
  },

  async createMany(
    currentUser: UserType,
    group: string,
    payments: Partial<CategoryType>[]
  ) {
    await dbConnect();

    const payload = payments.map((t) => ({
      ...t,
      createdBy: currentUser._id,
      group,
    }));

    return categoryRepository.insertMany(payload);
  },

  async updateOne(
    currentUser: UserType,
    categoryId: string,
    payload: Partial<CategoryType>
  ) {
    await dbConnect();

    await withAccessCheck(() => this.getOne(categoryId), currentUser, {
      getGroupId: (c) => c.group._id.toString(),
    });

    return categoryRepository.updateOne(categoryId, payload);
  },

  async deleteOne(currentUser: UserType, transactionId: string) {
    await dbConnect();

    const filter = buildTransactionAccessFilter(currentUser, {
      _id: transactionId,
    });

    const deleted = await categoryRepository.deleteOne(filter);

    if (!deleted) {
      throw new ForbiddenError();
    }

    return deleted;
  },

  async deleteMany(currentUser: UserType, ids: string[]) {
    await dbConnect();

    const filter = buildTransactionAccessFilter(currentUser, {
      _id: { $in: ids },
    });

    const result = await categoryRepository.deleteMany(filter);

    return result.deletedCount;
  },
};
