import mongoose from "mongoose";
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model("Group", GroupSchema);
