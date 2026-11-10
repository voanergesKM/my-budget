import { Schema, Types } from "mongoose";

import { VEHICLE_TRANSACTION_TYPES } from "@/app/lib/constants";
import { fuelTypes, vehicleTypes } from "@/app/lib/types/vehicle";

import { getCurrentModel } from "./getCurrentModel.ts";

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

    transactionCategories: {
      type: new Schema(
        Object.fromEntries(
          VEHICLE_TRANSACTION_TYPES.map((key) => [
            key,
            { type: Types.ObjectId, ref: "Category" },
          ])
        ),
        { _id: false }
      ),
      default: undefined,
    },

    isMissed: Boolean,

    type: {
      type: String,
      enum: vehicleTypes,
      required: true,
    },

    fuelType: {
      type: String,
      enum: fuelTypes,
    },

    distanceUnit: { type: String, enum: ["km", "mi"], default: "km" },
    fuelUnit: { type: String, enum: ["l", "us_gal"], default: "l" },
    showMetricUnits: { type: Boolean, default: false },

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

    reminderSettings: {
      type: Map,
      of: new Schema(
        {
          dateGapDays: {
            type: Number,
            enum: [0, 1, 7, 14, 30, 90, 180],
            default: 14,
          },
          odometerGapKm: {
            type: Number,
            min: 0,
            default: 1000,
          },
        },
        { _id: false }
      ),
      default: () => ({
        default: {},
      }),
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

export const Vehicle = getCurrentModel("Vehicle", VehicleSchema, [
  "distanceUnit",
  "fuelUnit",
  "showMetricUnits",
]);
