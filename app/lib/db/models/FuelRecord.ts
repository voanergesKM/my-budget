import mongoose, { Schema } from "mongoose";

const FuelRecordSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },

    odometer: {
      type: Number,
      required: true,
    },

    liters: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ["USD", "EUR", "UAH"],
      default: "USD",
    },

    fullTank: {
      type: Boolean,
      required: true,
    },

    isMissed: {
      type: Boolean,
      default: false,
    },

    station: String,
    location: String,
    notes: String,

    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },

    imported: String,
  },
  { timestamps: true }
);

export const FuelRecord =
  mongoose.models.FuelRecord || mongoose.model("FuelRecord", FuelRecordSchema);
