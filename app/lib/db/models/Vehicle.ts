import mongoose, { Schema, Types } from "mongoose";

import { fuelTypes, vehicleTypes } from "@/app/lib/types/vehicle";

const VehicleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    imageSrc: {
      type: String,
    },

    group: {
      type: Types.ObjectId,
      ref: "Group",
    },

    category: {
      type: Types.ObjectId,
      ref: "Category",
    },

    type: {
      type: String,
      enum: vehicleTypes,
      required: true,
    },

    fuelType: {
      type: String,
      enum: fuelTypes,
    },

    odometer: {
      type: Number,
      min: 0,
    },

    currentOdometer: {
      type: Number,
      min: 0,
    },

    vinCode: {
      type: String,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

VehicleSchema.pre("save", function (next) {
  if (this.type !== "car") {
    this.fuelType = undefined;
    this.odometer = undefined;
    this.vinCode = undefined;
  }
  next();
});

export const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
