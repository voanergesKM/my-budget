import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduledPaymentHistorySchema = new Schema({
  scheduledPayment: {
    type: Schema.Types.ObjectId,
    ref: "ScheduledPayment",
    required: true,
  },
  transaction: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
  },
  action: {
    type: String,
    enum: ["skipped", "executed", "error"],
    required: true,
  },
  errorMessage: String,
  executedAt: {
    type: Date,
    default: Date.now,
  },
  proceedDate: Date,
  nextProceedDate: Date,
});

export default mongoose.models.ScheduledPaymentHistory ||
  mongoose.model("ScheduledPaymentHistory", ScheduledPaymentHistorySchema);
