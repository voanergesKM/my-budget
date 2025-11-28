import {
  Transaction as TransactionType,
  User as UserType,
} from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";
import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

import {
  buildTransactionMatch,
  buildTransactionsSummaryByMonthPipeline,
  buildTransactionsSummaryPipeline,
  transformMonthlyAggregationResult,
} from "@/app/lib/db/agregations/transactionPipelines";
import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { Transaction } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";

export async function getAllTransactions(
  currentUser: UserType,
  groupId: string | null,
  origin: string | null,
  page: number,
  pageSize: number,
  from?: string | null,
  to?: string | null,
  cid?: string | null
) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query: Record<string, any> = groupId
    ? { group: groupId, type: origin }
    : { createdBy: currentUser._id, type: origin };

  if (!!groupId) {
    await getGroupById(groupId, currentUser);
  }

  if (from || to) {
    query.createdAt = {};
    if (from) {
      query.createdAt.$gte = new Date(from);
    }
    if (to) {
      query.createdAt.$lte = new Date(to);
    }
  }

  if (cid) {
    query.category = cid;
  }

  const [list, totalCount] = await Promise.all([
    Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate(["category", "group", "createdBy"]),

    Transaction.countDocuments(query),
  ]);

  return {
    list,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasMore: page < Math.ceil(totalCount / pageSize),
  };
}

export async function createTransaction(
  currentUser: UserType,
  groupId: string,
  payload: Partial<TransactionType>
) {
  await dbConnect();

  const { _id, transientId, ...rest } = payload;

  if (!!groupId) {
    await getGroupById(groupId, currentUser);
  }

  return await Transaction.create({
    ...rest,
    createdBy: currentUser._id,
    group: groupId,
  });
}

export async function updateTransaction(
  currentUser: UserType,
  transactionId: string,
  payload: Partial<TransactionType>
) {
  await dbConnect();

  await withAccessCheck(() => Transaction.findById(transactionId), currentUser);

  return await Transaction.findByIdAndUpdate(transactionId, payload, {
    new: true,
  });
}

export async function deleteTransaction(
  currentUser: UserType,
  transactionId: string
) {
  await dbConnect();

  await withAccessCheck(() => Transaction.findById(transactionId), currentUser);

  return await Transaction.findByIdAndDelete(transactionId);
}

export async function getTransactiopnsSummary(
  currentUser: UserType,
  groupId: string | null,
  origin: string | null,
  from?: Date,
  to?: Date
) {
  await dbConnect();

  const match = buildTransactionMatch(currentUser, groupId, origin, from, to);

  const pipeline = buildTransactionsSummaryPipeline(match);
  return await Transaction.aggregate(pipeline);
}

export async function getTransactionsSummaryByMonth(
  currentUser: UserType,
  groupId: string | null,
  origin: string | null
) {
  await dbConnect();

  const match = buildTransactionMatch(currentUser, groupId, origin);

  const pipeline = buildTransactionsSummaryByMonthPipeline(match, 6);
  const result = await Transaction.aggregate(pipeline);

  const tNamespace = await withServerTranslations("monthMap");
  return transformMonthlyAggregationResult(result, tNamespace);
}
