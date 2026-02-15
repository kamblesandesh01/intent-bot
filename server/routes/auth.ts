import { RequestHandler } from "express";
import User from "../models/User";
import Session from "../models/Session";
import { connectDB } from "../db";
import { SignupSchema, LoginSchema, ProfileImageSchema } from "../../shared/validation";

// Helper to generate simple IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    // Validate request body with Zod
    const validation = SignupSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        message: "User with this email already exists",
      });
      return;
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      name,
    });

    await newUser.save();

    // Create session
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      sessionId,
      userId: newUser._id.toString(),
      expiresAt,
    });
    await session.save();

    // Set session cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Signup failed",
    });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    // Validate request body with Zod
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = validation.data;

    // Find user and include password for comparison
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Create session
    const sessionId = generateId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      sessionId,
      userId: user._id.toString(),
      expiresAt,
    });
    await session.save();

    // Set session cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await Session.findOneAndDelete({ sessionId });
    }

    res.clearCookie("sessionId");
    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Logout failed",
    });
  }
};

export const handleGetMe: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      res.status(401).json({
        message: "Invalid session",
      });
      return;
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      await Session.findOneAndDelete({ sessionId });
      res.status(401).json({
        message: "Session expired",
      });
      return;
    }

    const user = await User.findById(session.userId);
    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Failed to get user",
    });
  }
};

export const handleUpdateProfileImage: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const userId = (req as any).userId;
    const validation = ProfileImageSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }
    const { profileImage } = validation.data;
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImage ?? "" },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({
      message: "Profile image updated",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update profile image error:", error);
    res.status(500).json({ message: "Failed to update profile image" });
  }
};
