import mongoose from "mongoose";

const { Schema } = mongoose;

const ShoppingItemSchema = new Schema(
  {
    id: String,
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: "pcs" },
    amount: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  },
  { timestamps: true }
);

const ShoppingSchema = new Schema(
  {
    title: { type: String, required: true },
    items: [ShoppingItemSchema],
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    color: String,
    category: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true }
);

export default mongoose.models.Shopping ||
  mongoose.model("Shopping", ShoppingSchema);
