import { User as UserType } from "@/app/lib/definitions";

import { ScheduledPayment } from "@/app/lib/db/models";
import { ScheduledPaymentType } from "@/app/lib/types";

export const scheduledPaymentRepository = {
  find(query: Record<string, any>, skip: number, limit: number) {
    return ScheduledPayment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(["category", "group", "createdBy"]);
  },

  findById(paymentId: string) {
    return ScheduledPayment.findById(paymentId).populate([
      "category",
      "group",
      "createdBy",
    ]);
  },

  create(currentUser: UserType, payload: Partial<ScheduledPaymentType>) {
    return ScheduledPayment.create({
      ...payload,
      createdBy: currentUser._id,
    });
  },

  count(query: Record<string, any>) {
    return ScheduledPayment.countDocuments(query);
  },

  insertMany(payload: any) {
    return ScheduledPayment.insertMany(payload);
  },

  updateOne(paymentId: string, payload: Partial<ScheduledPaymentType>) {
    return ScheduledPayment.findByIdAndUpdate(paymentId, payload, {
      new: true,
    });
  },

  deleteOne(filter: Record<string, any>) {
    return ScheduledPayment.findOneAndDelete(filter);
  },

  deleteMany(filter: Record<string, any>) {
    return ScheduledPayment.deleteMany(filter);
  },
};
