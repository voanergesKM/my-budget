import mongoose, { Schema } from "mongoose";

import { SERVICE_CATEGORIES } from "@/app/lib/constants";

const ServiceRecordSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },

    currency: {
      type: String,
      enum: ["USD", "EUR", "UAH"],
      default: "USD",
    },

    title: { type: String, required: true },

    category: {
      type: String,
      enum: SERVICE_CATEGORIES,
      required: true,
    },
    amount: { type: Number, required: true },
    odometer: Number,
    notes: String,

    imported: String,
  },
  { timestamps: true }
);

ServiceRecordSchema.index({ vehicle: 1, category: 1 });
ServiceRecordSchema.index({ vehicle: 1, createdAt: -1 });

export const ServiceRecord =
  mongoose.models.ServiceRecord ||
  mongoose.model("ServiceRecord", ServiceRecordSchema);
