import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduledPaymentSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group" },

    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    proceedDate: {
      type: Date,
      required: true,
    },
    skipNext: { type: Boolean, default: false },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "2weeks", "4weeks", "monthly", "annually"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    lastExecutedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ScheduledPayment ||
  mongoose.model("ScheduledPayment", ScheduledPaymentSchema);
