import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db";
import { validateEnv } from "./env";
import { authMiddleware } from "./middleware/auth";
import {
  handleSignup,
  handleLogin,
  handleLogout,
  handleGetMe,
  handleUpdateProfileImage,
} from "./routes/auth";
import { handleGoogleOAuth, handleGithubOAuth } from "./routes/oauth";
import {
  createConversation,
  listConversations,
  getConversation,
  addMessage,
  deleteConversation,
  updateConversationTitle,
} from "./routes/conversations";

export function createServer() {
  // Validate environment variables before starting
  validateEnv();

  const app = express();

  // Connect to MongoDB on server startup
  connectDB().catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

  // Middleware (2MB limit for profile image base64)
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(cookieParser());

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Auth API routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/me", handleGetMe);
  app.patch("/api/auth/profile", authMiddleware, handleUpdateProfileImage);

  // OAuth routes
  app.post("/api/auth/google", handleGoogleOAuth);
  app.post("/api/auth/github", handleGithubOAuth);

  // Conversation API routes (protected with auth middleware)
  app.post("/api/conversations", authMiddleware, createConversation);
  app.get("/api/conversations", authMiddleware, listConversations);
  app.get("/api/conversations/:conversationId", authMiddleware, getConversation);
  app.post("/api/conversations/:conversationId/messages", authMiddleware, addMessage);
  app.delete("/api/conversations/:conversationId", authMiddleware, deleteConversation);
  app.patch("/api/conversations/:conversationId", authMiddleware, updateConversationTitle);

  return app;
}
