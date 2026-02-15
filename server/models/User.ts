import mongoose, { Document, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  oauth?: {
    provider: "google" | "github";
    providerId: string;
    profileImage?: string;
  };
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    oauth: {
      provider: {
        type: String,
        enum: ["google", "github"],
      },
      providerId: String,
      profileImage: String,
    },
    profileImage: String,
  },
  { timestamps: true }
);

// Hash password before saving (only if password exists and is modified)
userSchema.pre("save", async function () {
  // Only hash if password exists and is modified
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  // OAuth users don't have passwords
  if (!this.password) {
    return false;
  }
  return await bcryptjs.compare(password, this.password);
};

// Create or get the User model
const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
