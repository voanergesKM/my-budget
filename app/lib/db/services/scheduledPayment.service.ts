import { User as UserType } from "@/app/lib/definitions";
import { buildQuery } from "@/app/lib/utils/buildQuery";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { buildTransactionAccessFilter } from "@/app/lib/db/access";
import dbConnect from "@/app/lib/db/mongodb";
import { scheduledPaymentRepository } from "@/app/lib/db/repositories";
import { ForbiddenError } from "@/app/lib/errors/customErrors";
import { ScheduledPaymentType } from "@/app/lib/types";

type Query = Record<string, any>;

export const scheduledPaymentService = {
  async getAll(currentUser: UserType, groupId: string | null, query: Query) {
    await dbConnect();

    const { paginationParams, mongoQuery } = buildQuery(
      query,
      currentUser,
      groupId
    );

    const skip = (paginationParams.page - 1) * paginationParams.pageSize;

    const [list, totalCount] = await Promise.all([
      scheduledPaymentRepository.findPaginated(
        mongoQuery,
        skip,
        paginationParams.pageSize,
        ["category", "group", "createdBy"]
      ),
      scheduledPaymentRepository.count(mongoQuery),
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

  async getOne(paymentId: string) {
    await dbConnect();

    return scheduledPaymentRepository.findById(paymentId);
  },

  async create(currentUser: UserType, payments: Partial<ScheduledPaymentType>) {
    await dbConnect();

    const payload = {
      ...payments,
      createdBy: currentUser._id,
    };

    return scheduledPaymentRepository.create(payload);
  },

  async createMany(
    currentUser: UserType,
    group: string,
    payments: Partial<ScheduledPaymentType>[]
  ) {
    await dbConnect();

    const payload = payments.map((t) => ({
      ...t,
      createdBy: currentUser._id,
      group,
    }));

    return scheduledPaymentRepository.insertMany(payload);
  },

  async updateOne(
    currentUser: UserType,
    paymentId: string,
    payload: Partial<ScheduledPaymentType>
  ) {
    await dbConnect();

    await withAccessCheck(() => this.getOne(paymentId), currentUser, {
      getGroupId: (c) => c.group._id.toString(),
    });

    return scheduledPaymentRepository.updateOne(paymentId, payload);
  },

  async deleteOne(currentUser: UserType, transactionId: string) {
    await dbConnect();

    const filter = buildTransactionAccessFilter(currentUser, {
      _id: transactionId,
    });

    const deleted = await scheduledPaymentRepository.deleteOne(filter);

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

    const result = await scheduledPaymentRepository.deleteMany(filter);

    return result.deletedCount;
  },
};
