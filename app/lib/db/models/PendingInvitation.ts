import mongoose from "mongoose";

const { Schema } = mongoose;

const PendingInvitationSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, default: () => Date.now() + 1000 * 60 * 60 * 24 }, // 24h
  },
  { timestamps: true }
);

PendingInvitationSchema.index({ email: 1, groupId: 1 }, { unique: true });

export default mongoose.models.PendingInvitation ||
  mongoose.model("PendingInvitation", PendingInvitationSchema);
