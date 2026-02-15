import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  userId: string;
  title: string;
  messageIds: string[];
  messageCount: number;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messageIds: [
      {
        type: String,
        index: true,
      },
    ],
    messageCount: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, updatedAt: -1 });

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
