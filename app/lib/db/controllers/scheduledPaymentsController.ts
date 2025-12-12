import { User as UserType } from "@/app/lib/definitions";
import { withAccessCheck } from "@/app/lib/utils/withAccessCheck";

import { ScheduledPaymentType } from "@/app/lib/types";

import ScheduledPayment from "../models/ScheduledPayment";
import dbConnect from "../mongodb";

import { getGroupById } from "./groupController";

export async function getScheduledPayments(
  currentUser: UserType,
  groupId: string | null,
  page: number,
  pageSize: number
) {
  await dbConnect();

  const skip = (page - 1) * pageSize;

  const query: Record<string, any> = groupId
    ? { group: groupId }
    : { createdBy: currentUser._id };

  if (!!groupId) {
    await getGroupById(groupId, currentUser);
  }

  const [list, totalCount] = await Promise.all([
    ScheduledPayment.find(query)
      .sort({ proceedDate: 1 })
      .skip(skip)
      .limit(pageSize)
      .populate(["category", "createdBy", "group"]),

    ScheduledPayment.countDocuments(query),
  ]);

  return {
    list,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    hasMore: page < Math.ceil(totalCount / pageSize),
  };
}

export async function updateScheduledPayment(
  currentUser: UserType,
  paymentId: string,
  payload: Partial<ScheduledPaymentType>
) {
  await dbConnect();

  await withAccessCheck(
    () => ScheduledPayment.findById(paymentId),
    currentUser
  );

  return await ScheduledPayment.findByIdAndUpdate(paymentId, payload, {
    new: true,
  });
}

export async function createScheduledPayment(
  currentUser: UserType,
  payload: Partial<ScheduledPaymentType>
) {
  await dbConnect();

  if (typeof payload.group === "string") {
    await getGroupById(payload.group, currentUser);
  }

  return await ScheduledPayment.create({
    ...payload,
    createdBy: currentUser._id,
  });
}

export async function deleteScheduledPayment(
  currentUser: UserType,
  paymentId: string
) {
  await dbConnect();

  await withAccessCheck(
    () => ScheduledPayment.findById(paymentId),
    currentUser
  );

  return await ScheduledPayment.findByIdAndDelete(paymentId);
}
