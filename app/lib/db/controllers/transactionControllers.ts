import mongoose, { PipelineStage } from "mongoose";

import {
  Transaction as TransactionType,
  User as UserType,
} from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import dbConnect from "@/app/lib/db/mongodb";

import { Transaction } from "../models";

import { getGroupById } from "./groupController";

export async function getAllTransactions(
  currentUser: UserType,
  groupId: string | null,
  origin: string | null,
  page: number,
  pageSize: number
) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query = groupId
    ? { group: groupId, type: origin }
    : { createdBy: currentUser._id, type: origin };

  if (!!groupId) {
    await getGroupById(groupId, currentUser);
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

  const { _id, ...rest } = payload;

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

  const match: Record<string, any> = { type: origin };

  if (groupId) {
    await getGroupById(groupId, currentUser);

    match.group = new mongoose.Types.ObjectId(groupId);
  } else {
    match.createdBy = currentUser._id;
  }

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const pipeline: PipelineStage[] = [
    { $match: match },
    {
      $group: {
        _id: {
          currency: "$currency",
          category: "$category",
        },
        total: { $sum: "$amount" },
        amountInBaseCurrency: { $sum: "$amountInBaseCurrency" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id.category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $project: {
        _id: 0,
        categoryId: "$_id.category",
        categoryName: "$categoryInfo.name",
        categoryIcon: "$categoryInfo.icon",
        categoryColor: "$categoryInfo.color",
        currency: "$_id.currency",
        total: 1,
        amountInBaseCurrency: 2,
      },
    },
    {
      $sort: { amountInBaseCurrency: -1 },
    },
  ];

  return await Transaction.aggregate(pipeline);
}
