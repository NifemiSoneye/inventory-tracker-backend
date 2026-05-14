import mongoose, { Schema, Document } from "mongoose";

import { Iitem } from "../types";

interface IItemDocument extends Iitem, Document {}

const itemSchema = new Schema<IItemDocument>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["In stock", "Low stock", "Out of stock"],
  },
});

export default mongoose.model<IItemDocument>("Item", itemSchema);
