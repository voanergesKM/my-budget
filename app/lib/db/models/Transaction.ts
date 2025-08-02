import mongoose from "mongoose";

const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    description: String,
    amount: Number,
    type: {
      type: String,
      enum: ["incoming", "outgoing"],
      default: "outgoing",
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "UAH"],
      default: "USD",
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
