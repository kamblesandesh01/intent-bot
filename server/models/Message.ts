import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: [true, "Conversation ID is required"],
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
    },
    intent: {
      type: String,
      index: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  { timestamps: true }
);

// Index for finding messages by conversation
messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
