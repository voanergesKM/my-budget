import mongoose from "mongoose";

const { Schema } = mongoose;

const ExchangeRateSchema = new Schema({
  base: { type: String, default: "EUR" },
  rates: { type: Map, of: Number },
  date: { type: String, required: true },
});

ExchangeRateSchema.index({ date: 1 }, { unique: true });

export default mongoose.models.ExchangeRate ||
  mongoose.model("ExchangeRate", ExchangeRateSchema);
