import mongoose, { PipelineStage } from "mongoose";

import { User as UserType } from "@/app/lib/definitions";

export function buildTransactionMatch(
  currentUser: UserType,
  groupId: string | null,
  origin: string | null,
  from?: Date | string | null,
  to?: Date | string | null
): Record<string, any> {
  const match: Record<string, any> = { type: origin };

  if (groupId) {
    match.group = new mongoose.Types.ObjectId(groupId);
  } else {
    match.createdBy = currentUser._id;
  }

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  return match;
}

export function buildTransactionsSummaryPipeline(
  match: Record<string, any>
): PipelineStage[] {
  return [
    { $match: match },
    {
      $group: {
        _id: { currency: "$currency", category: "$category" },
        total: { $sum: "$amount" },
        amountInBaseCurrency: { $sum: "$amountInBaseCurrency" },
      },
    },
    {
      $lookup: {
        from: "categories",
        let: { categoryId: "$_id.category" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$categoryId"] },
              includeInAnalytics: true,
            },
          },
        ],
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
        amountInBaseCurrency: 1,
      },
    },
    { $sort: { amountInBaseCurrency: -1 } },
  ];
}

export function buildTransactionsSummaryByMonthPipeline(
  match: Record<string, any>,
  monthsBack = 6
): PipelineStage[] {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsBack);
  match.createdAt = match.createdAt || {};
  match.createdAt.$gte = date;

  return [
    { $match: match },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          currency: "$currency",
        },
        total: { $sum: "$amount" },
        amountInBaseCurrency: { $sum: "$amountInBaseCurrency" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ];
}

export function transformMonthlyAggregationResult(
  result: any[],
  tNamespace: (key: string) => string
) {
  return result
    .reduce((acc: any[], month: any) => {
      const monthId = month._id.month;
      const monthName = tNamespace(monthId.toString());

      const existing = acc.find((m: any) => m.month === monthName);
      const payload = {
        total: month.total,
        amountInBaseCurrency: month.amountInBaseCurrency,
      };

      if (!existing) {
        const entry: any = { month: monthName };
        entry[month._id.currency] = payload;
        acc.push(entry);
      } else {
        existing[month._id.currency] = payload;
      }

      return acc;
    }, [])
    .reverse();
}
