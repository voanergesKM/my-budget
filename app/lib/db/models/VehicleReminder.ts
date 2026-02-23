import mongoose, { Schema } from "mongoose";

const VehicleReminderSchema = new Schema(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    record: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRecord",
    },

    title: { type: String, required: true },

    triggerDate: Date,
    triggerOdometer: Number,

    status: {
      type: String,
      enum: ["scheduled", "due", "overdue", "completed", "dismissed"],
      default: "scheduled",
    },

    completedAt: Date,

    imported: String,
  },
  { timestamps: true }
);

export const VehicleReminder =
  mongoose.models.VehicleReminder ||
  mongoose.model("VehicleReminder", VehicleReminderSchema);
