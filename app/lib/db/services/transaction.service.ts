import { Transaction as TransactionType, User as UserType, } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import { buildTransactionAccessFilter } from "@/app/lib/db/access";
import {
  buildTransactionMatch,
  buildTransactionsSummaryByMonthPipeline,
  buildTransactionsSummaryPipeline,
  transformMonthlyAggregationResult,
} from "@/app/lib/db/agregations/transactionPipelines";
import { Transaction } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";
import { transactionRepository } from "@/app/lib/db/repositories/transaction.repository";
import { ForbiddenError } from "@/app/lib/errors/customErrors";

type Query = Record<string, any>;

export const transactionService = {
  async getAll(currentUser: UserType, groupId: string | null, query: Query) {
    await dbConnect();

    const { paginationParams, mongoQuery } = buildQuery(
      query,
      currentUser,
      groupId
    );

    const skip = (paginationParams.page - 1) * paginationParams.pageSize;

    const [list, totalCount] = await Promise.all([
      transactionRepository.find(mongoQuery, skip, paginationParams.pageSize),
      transactionRepository.count(mongoQuery),
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

  async createMany(
    currentUser: UserType,
    group: string,
    transactions: Partial<TransactionType>[]
  ) {
    await dbConnect();

    const payload = transactions.map((t) => ({
      ...t,
      createdBy: currentUser._id,
      group,
    }));

    return transactionRepository.insertMany(payload);
  },

  async updateOne(
    currentUser: UserType,
    transactionId: string,
    payload: Partial<TransactionType>
  ) {
    await dbConnect();

    await withAccessCheck(
      () => Transaction.findById(transactionId),
      currentUser
    );

    return transactionRepository.updateOne(transactionId, payload);
  },

  async deleteOne(currentUser: UserType, transactionId: string) {
    await dbConnect();

    const filter = buildTransactionAccessFilter(currentUser, {
      _id: transactionId,
    });

    const deleted = await transactionRepository.deleteOne(filter);

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

    const result = await transactionRepository.deleteMany(filter);

    return result.deletedCount;
  },

  async getSummary(
    currentUser: UserType,
    groupId: string | null,
    origin: string | null,
    from?: Date,
    to?: Date
  ) {
    await dbConnect();

    const match = buildTransactionMatch(currentUser, groupId, origin, from, to);

    const pipeline = buildTransactionsSummaryPipeline(match);

    return transactionRepository.summary(pipeline);
  },

  async getSummaryByMonth(
    currentUser: UserType,
    groupId: string | null,
    origin: string | null
  ) {
    await dbConnect();

    const match = buildTransactionMatch(currentUser, groupId, origin);

    const pipeline = buildTransactionsSummaryByMonthPipeline(match, 5);
    const result = await transactionRepository.summary(pipeline);

    const tNamespace = await withServerTranslations("monthMap");
    return transformMonthlyAggregationResult(result, tNamespace);
  },
};

function buildQuery(
  query: Query,
  currentUser: UserType,
  groupId: string | null
) {
  const { page = 1, pageSize = 10, ...params } = query;

  const mongoQuery: Query = {};

  if (params.origin) {
    mongoQuery.type = params.origin;
  }

  if (groupId) {
    mongoQuery.group = groupId;
  } else {
    mongoQuery.createdBy = currentUser._id;
  }

  if (params.from || params.to) {
    mongoQuery.createdAt = {};
    if (params.from) {
      mongoQuery.createdAt.$gte = new Date(params.from);
    }
    if (params.to) {
      mongoQuery.createdAt.$lte = new Date(params.to);
    }
  }

  if (params.cid) {
    mongoQuery.category = params.cid;
  }

  return {
    paginationParams: {
      page,
      pageSize,
    },
    mongoQuery,
  };
}
