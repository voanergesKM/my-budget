import { PipelineStage } from "mongoose";

import { Transaction as TransactionType } from "@/app/lib/definitions";

import { Transaction } from "@/app/lib/db/models";

export const transactionRepository = {
  find(query: Record<string, any>, skip: number, limit: number) {
    return Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(["category", "group", "createdBy"]);
  },

  count(query: Record<string, any>) {
    return Transaction.countDocuments(query);
  },

  insertMany(payload: any) {
    return Transaction.insertMany(payload);
  },

  updateOne(transactionId: string, payload: Partial<TransactionType>) {
    return Transaction.findByIdAndUpdate(transactionId, payload, {
      new: true,
    });
  },

  deleteOne(filter: Record<string, any>) {
    return Transaction.findOneAndDelete(filter);
  },

  deleteMany(filter: Record<string, any>) {
    return Transaction.deleteMany(filter);
  },

  summary(pipeline: PipelineStage[]) {
    return Transaction.aggregate(pipeline);
  },
};
