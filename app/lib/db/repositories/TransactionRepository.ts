import { Transaction } from "@/app/lib/db/models";

import { BaseRepository } from "./BaseRepository";

class TransactionRepository extends BaseRepository<any> {
  constructor() {
    super(Transaction);
  }

  findById(paymentId: string) {
    return this.model
      .findById(paymentId)
      .populate(["category", "group", "createdBy"]);
  }
}

export const transactionRepository = new TransactionRepository();
