import {
  Transaction as TransactionType,
  User as UserType,
} from "@/app/lib/definitions";

import { getGroupById } from "@/app/lib/db/controllers/groupController";
import { Shopping, Transaction } from "@/app/lib/db/models";
import dbConnect from "@/app/lib/db/mongodb";

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

  const createdTransaction = await Transaction.create({
    ...rest,
    createdBy: currentUser._id,
    group: groupId,
  });

  if (payload.items?.length) {
    await Shopping.updateMany(
      { "items._id": { $in: payload.items } },
      {
        $set: {
          "items.$[item].transaction": createdTransaction._id,
        },
      },
      {
        arrayFilters: [{ "item._id": { $in: payload.items } }],
      }
    );
  }

  return createdTransaction;
}
