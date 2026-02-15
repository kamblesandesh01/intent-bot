import mongoose, { Document, Schema } from "mongoose";

export interface IIntent extends Document {
  name: string;
  description: string;
  keywords: string[];
  category: string;
  color: string;
  confidence_threshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

const intentSchema = new Schema<IIntent>(
  {
    name: {
      type: String,
      required: [true, "Intent name is required"],
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Intent description is required"],
    },
    keywords: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      enum: ["greeting", "question", "request", "feedback", "help", "other"],
      default: "other",
    },
    color: {
      type: String,
      default: "bg-gray-100 text-gray-700",
    },
    confidence_threshold: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
  },
  { timestamps: true }
);

const Intent =
  mongoose.models.Intent || mongoose.model<IIntent>("Intent", intentSchema);

export default Intent;
