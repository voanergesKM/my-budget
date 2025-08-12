import mongoose from "mongoose";

const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    description: String,
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },
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
    baseCurrency: {
      type: String,
      enum: ["EUR", "USD", "UAH"],
      default: "EUR",
    },
    amountInBaseCurrency: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      set: (value: string) => (value === "" ? undefined : value),
      validate: {
        validator: function (value: mongoose.Types.ObjectId) {
          return mongoose.Types.ObjectId.isValid(value);
        },
        message: "Invalid category id",
      },
    },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
