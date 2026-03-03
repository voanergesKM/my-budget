import { ScheduledPayment } from "@/app/lib/db/models";

import { BaseRepository } from "./BaseRepository";

class ScheduledPaymentRepository extends BaseRepository<any> {
  constructor() {
    super(ScheduledPayment);
  }

  findById(paymentId: string) {
    return this.model
      .findById(paymentId)
      .populate(["category", "group", "createdBy"]);
  }
}

export const scheduledPaymentRepository = new ScheduledPaymentRepository();
