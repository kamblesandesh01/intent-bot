import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-delete expired sessions
    },
  },
  { timestamps: true }
);

const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);

export default Session;
