import mongoose, { Schema } from "mongoose";

import { VEHICLE_REMIND_STATUS } from "@/app/lib/constants";

const VehicleReminderSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    record: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRecord",
    },

    title: { type: String, required: true },
    category: String,

    triggerDate: Date,
    triggerOdometer: Number,

    status: {
      type: String,
      enum: VEHICLE_REMIND_STATUS,
      default: "scheduled",
    },

    completedAt: Date,

    imported: String,
  },
  { timestamps: true }
);

VehicleReminderSchema.index({ vehicle: 1, status: 1 });
VehicleReminderSchema.index({ triggerDate: 1 });
VehicleReminderSchema.index({ triggerOdometer: 1 });

export const VehicleReminder =
  mongoose.models.VehicleReminder ||
  mongoose.model("VehicleReminder", VehicleReminderSchema);
