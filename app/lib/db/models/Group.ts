import mongoose from "mongoose";

import { Group } from "@/app/lib/definitions";

const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

GroupSchema.virtual("totalMembers").get(function (this: Group) {
  return this.members ? this.members.length : 0;
});

export default mongoose.models.Group || mongoose.model("Group", GroupSchema);
