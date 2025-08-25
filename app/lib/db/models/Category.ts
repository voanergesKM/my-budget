import mongoose from "mongoose";

import { Group, User } from "../models";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    icon: String,
    color: String,
    type: {
      type: String,
      enum: ["incoming", "outgoing"],
      default: "outgoing",
    },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    includeInAnalytics: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
